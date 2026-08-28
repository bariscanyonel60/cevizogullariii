import { createCipheriv, createDecipheriv, createHash, randomBytes, randomUUID } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { get, put } from "@vercel/blob";
import {
  readAccountingFromMysql,
  writeAccountingToMysql,
} from "@/lib/db/accounting-sql";
import { isDatabaseConfigured } from "@/lib/db/pool";
import {
  emptyAccountingStore,
  isCreditKind,
  isIsoDate,
  isPaymentMethod,
  isValidPhone,
  isValidTc,
  isVatRate,
  type AccountingStore,
  type Advance,
  type CreditEntry,
  type Customer,
  type Sale,
  type StaffMember,
} from "@/lib/accounting-types";

const LOCAL_DIR = join(process.cwd(), ".data");
const LOCAL_FILE = join(LOCAL_DIR, "accounting-store.json");
const PRIVATE_BLOB_PATH = "accounting/ledger.json";
const ENCRYPTED_BLOB_PATH = "accounting/ledger.enc.json";

function blobAvailable() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function encryptionKey(): Buffer | null {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return null;
  return createHash("sha256").update(secret).digest();
}

function encryptJson(data: AccountingStore): string | null {
  const key = encryptionKey();
  if (!key) return null;
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([
    cipher.update(Buffer.from(JSON.stringify(data), "utf8")),
    cipher.final(),
  ]);
  const payload = Buffer.concat([iv, cipher.getAuthTag(), encrypted]);
  return payload.toString("base64");
}

function decryptJson(encoded: string): AccountingStore | null {
  const key = encryptionKey();
  if (!key) return null;
  const buffer = Buffer.from(encoded, "base64");
  const iv = buffer.subarray(0, 12);
  const tag = buffer.subarray(12, 28);
  const encrypted = buffer.subarray(28);
  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  const decoded = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return parseStore(JSON.parse(decoded.toString("utf8")));
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function asNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : Number.NaN;
}

function parseStore(data: unknown): AccountingStore {
  const empty = emptyAccountingStore();
  if (!data || typeof data !== "object") return empty;
  const record = data as Partial<AccountingStore>;
  return {
    sales: Array.isArray(record.sales) ? record.sales.filter(isSale) : [],
    staff: Array.isArray(record.staff) ? record.staff.filter(isStaff) : [],
    advances: Array.isArray(record.advances)
      ? record.advances.filter(isAdvance)
      : [],
    customers: Array.isArray(record.customers)
      ? record.customers.filter(isCustomer)
      : [],
    creditEntries: Array.isArray(record.creditEntries)
      ? record.creditEntries.filter(isCreditEntry)
      : [],
  };
}

function isSale(value: unknown): value is Sale {
  if (!value || typeof value !== "object") return false;
  const item = value as Sale;
  return (
    typeof item.id === "string" &&
    isIsoDate(item.date) &&
    typeof item.productName === "string" &&
    Number.isFinite(item.quantity) &&
    Number.isFinite(item.unitPrice) &&
    isVatRate(item.vatRate) &&
    isPaymentMethod(item.paymentMethod)
  );
}

function isStaff(value: unknown): value is StaffMember {
  if (!value || typeof value !== "object") return false;
  const item = value as StaffMember;
  return typeof item.id === "string" && typeof item.name === "string";
}

function isAdvance(value: unknown): value is Advance {
  if (!value || typeof value !== "object") return false;
  const item = value as Advance;
  return (
    typeof item.id === "string" &&
    typeof item.staffId === "string" &&
    isIsoDate(item.date) &&
    Number.isFinite(item.amount)
  );
}

function isCustomer(value: unknown): value is Customer {
  if (!value || typeof value !== "object") return false;
  const item = value as Customer;
  return (
    typeof item.id === "string" &&
    typeof item.firstName === "string" &&
    typeof item.lastName === "string" &&
    typeof item.tc === "string"
  );
}

function isCreditEntry(value: unknown): value is CreditEntry {
  if (!value || typeof value !== "object") return false;
  const item = value as CreditEntry;
  return (
    typeof item.id === "string" &&
    typeof item.customerId === "string" &&
    isCreditKind(item.kind) &&
    isIsoDate(item.date) &&
    Number.isFinite(item.amount)
  );
}

function readLocal(): AccountingStore {
  try {
    if (!existsSync(LOCAL_FILE)) return emptyAccountingStore();
    return parseStore(JSON.parse(readFileSync(LOCAL_FILE, "utf8")));
  } catch {
    return emptyAccountingStore();
  }
}

function writeLocal(store: AccountingStore) {
  mkdirSync(LOCAL_DIR, { recursive: true });
  writeFileSync(LOCAL_FILE, JSON.stringify(store, null, 2), "utf8");
}

async function streamToText(stream: ReadableStream<Uint8Array>) {
  return new Response(stream).text();
}

async function readPrivateBlob(): Promise<AccountingStore | null> {
  if (!blobAvailable()) return null;
  try {
    const result = await get(PRIVATE_BLOB_PATH, {
      access: "private",
      useCache: false,
    });
    if (!result || result.statusCode !== 200) return null;
    return parseStore(JSON.parse(await streamToText(result.stream)));
  } catch {
    return null;
  }
}

async function readEncryptedBlob(): Promise<AccountingStore | null> {
  if (!blobAvailable()) return null;
  try {
    const result = await get(ENCRYPTED_BLOB_PATH, {
      access: "public",
      useCache: false,
    });
    if (!result || result.statusCode !== 200) return null;
    const body = JSON.parse(await streamToText(result.stream)) as {
      payload?: string;
    };
    if (!body.payload) return null;
    return decryptJson(body.payload);
  } catch {
    return null;
  }
}

async function writePrivateBlob(store: AccountingStore): Promise<boolean> {
  if (!blobAvailable()) return false;
  try {
    await put(PRIVATE_BLOB_PATH, JSON.stringify(store), {
      access: "private",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 60,
    });
    return true;
  } catch {
    return false;
  }
}

async function writeEncryptedBlob(store: AccountingStore): Promise<boolean> {
  if (!blobAvailable()) return false;
  const payload = encryptJson(store);
  if (!payload) return false;
  try {
    await put(
      ENCRYPTED_BLOB_PATH,
      JSON.stringify({ payload }),
      {
        access: "public",
        contentType: "application/json",
        addRandomSuffix: false,
        allowOverwrite: true,
        cacheControlMaxAge: 60,
      },
    );
    return true;
  } catch {
    return false;
  }
}

export async function getAccountingStore(): Promise<AccountingStore> {
  if (isDatabaseConfigured()) {
    return readAccountingFromMysql();
  }
  const fromPrivate = await readPrivateBlob();
  if (fromPrivate) return fromPrivate;
  const fromEncrypted = await readEncryptedBlob();
  if (fromEncrypted) return fromEncrypted;
  return readLocal();
}

async function saveAccountingStore(store: AccountingStore): Promise<void> {
  if (isDatabaseConfigured()) {
    await writeAccountingToMysql(store);
    return;
  }
  const privateOk = await writePrivateBlob(store);
  if (privateOk) return;
  const encryptedOk = await writeEncryptedBlob(store);
  if (encryptedOk) return;
  writeLocal(store);
}

function requiredText(value: unknown, label: string, min = 1): string {
  const text = asString(value).trim();
  if (text.length < min) {
    throw new Error(`${label} gerekli`);
  }
  return text;
}

function requiredDate(value: unknown, label = "Tarih"): string {
  const date = asString(value).trim();
  if (!isIsoDate(date)) throw new Error(`${label} geçersiz`);
  return date;
}

function requiredAmount(value: unknown, label: string): number {
  const amount = asNumber(value);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error(`${label} 0’dan büyük olmalı`);
  }
  return Math.round(amount * 1000) / 1000;
}

export async function createSale(input: unknown): Promise<AccountingStore> {
  const body = (input ?? {}) as Record<string, unknown>;
  const vatRate = body.vatRate;
  const paymentMethod = body.paymentMethod;
  if (!isVatRate(vatRate)) throw new Error("KDV oranı 1, 10 veya 20 olmalı");
  if (!isPaymentMethod(paymentMethod)) {
    throw new Error("Ödeme nakit veya kart olmalı");
  }

  const sale: Sale = {
    id: randomUUID(),
    date: requiredDate(body.date),
    productName: requiredText(body.productName, "Ürün", 2),
    quantity: requiredAmount(body.quantity, "Adet"),
    unitPrice: requiredAmount(body.unitPrice, "Birim fiyat"),
    vatRate,
    paymentMethod,
    note: asString(body.note).trim(),
    createdAt: new Date().toISOString(),
  };

  const store = await getAccountingStore();
  store.sales = [sale, ...store.sales];
  await saveAccountingStore(store);
  return store;
}

export async function deleteSale(id: string): Promise<AccountingStore> {
  const store = await getAccountingStore();
  const next = store.sales.filter((item) => item.id !== id);
  if (next.length === store.sales.length) throw new Error("Satış bulunamadı");
  store.sales = next;
  await saveAccountingStore(store);
  return store;
}

export async function createStaff(input: unknown): Promise<AccountingStore> {
  const body = (input ?? {}) as Record<string, unknown>;
  const staff: StaffMember = {
    id: randomUUID(),
    name: requiredText(body.name, "Personel adı", 2),
    createdAt: new Date().toISOString(),
  };
  const store = await getAccountingStore();
  store.staff = [staff, ...store.staff];
  await saveAccountingStore(store);
  return store;
}

export async function deleteStaff(id: string): Promise<AccountingStore> {
  const store = await getAccountingStore();
  if (store.advances.some((item) => item.staffId === id)) {
    throw new Error("Bu personelin avans kaydı var; önce avansları silin");
  }
  const next = store.staff.filter((item) => item.id !== id);
  if (next.length === store.staff.length) throw new Error("Personel bulunamadı");
  store.staff = next;
  await saveAccountingStore(store);
  return store;
}

export async function createAdvance(input: unknown): Promise<AccountingStore> {
  const body = (input ?? {}) as Record<string, unknown>;
  const store = await getAccountingStore();
  const staffId = requiredText(body.staffId, "Personel");
  if (!store.staff.some((item) => item.id === staffId)) {
    throw new Error("Personel bulunamadı");
  }

  const advance: Advance = {
    id: randomUUID(),
    staffId,
    date: requiredDate(body.date),
    amount: requiredAmount(body.amount, "Tutar"),
    note: asString(body.note).trim(),
    createdAt: new Date().toISOString(),
  };
  store.advances = [advance, ...store.advances];
  await saveAccountingStore(store);
  return store;
}

export async function deleteAdvance(id: string): Promise<AccountingStore> {
  const store = await getAccountingStore();
  const next = store.advances.filter((item) => item.id !== id);
  if (next.length === store.advances.length) throw new Error("Avans bulunamadı");
  store.advances = next;
  await saveAccountingStore(store);
  return store;
}

function parseCustomerFields(body: Record<string, unknown>) {
  const firstName = requiredText(body.firstName, "Ad", 2);
  const lastName = requiredText(body.lastName, "Soyad", 2);
  const tc = requiredText(body.tc, "T.C. kimlik no", 11);
  if (!isValidTc(tc)) throw new Error("T.C. kimlik no geçersiz");
  const phone = requiredText(body.phone, "Telefon", 10);
  if (!isValidPhone(phone)) throw new Error("Telefon geçersiz");
  const address = requiredText(body.address, "Adres", 5);
  return { firstName, lastName, tc, phone, address };
}

export async function createCustomer(input: unknown): Promise<AccountingStore> {
  const fields = parseCustomerFields((input ?? {}) as Record<string, unknown>);
  const store = await getAccountingStore();
  if (store.customers.some((item) => item.tc === fields.tc)) {
    throw new Error("Bu T.C. kimlik no ile kayıtlı müşteri var");
  }
  const customer: Customer = {
    id: randomUUID(),
    ...fields,
    createdAt: new Date().toISOString(),
  };
  store.customers = [customer, ...store.customers];
  await saveAccountingStore(store);
  return store;
}

export async function updateCustomer(
  id: string,
  input: unknown,
): Promise<AccountingStore> {
  const fields = parseCustomerFields((input ?? {}) as Record<string, unknown>);
  const store = await getAccountingStore();
  const index = store.customers.findIndex((item) => item.id === id);
  if (index === -1) throw new Error("Müşteri bulunamadı");
  if (
    store.customers.some((item) => item.tc === fields.tc && item.id !== id)
  ) {
    throw new Error("Bu T.C. kimlik no ile kayıtlı başka müşteri var");
  }
  store.customers[index] = {
    ...store.customers[index],
    ...fields,
  };
  await saveAccountingStore(store);
  return store;
}

export async function deleteCustomer(id: string): Promise<AccountingStore> {
  const store = await getAccountingStore();
  if (store.creditEntries.some((item) => item.customerId === id)) {
    throw new Error("Kartta hareket var; önce veresiye kayıtlarını silin");
  }
  const next = store.customers.filter((item) => item.id !== id);
  if (next.length === store.customers.length) {
    throw new Error("Müşteri bulunamadı");
  }
  store.customers = next;
  await saveAccountingStore(store);
  return store;
}

export async function createCreditEntry(
  input: unknown,
): Promise<AccountingStore> {
  const body = (input ?? {}) as Record<string, unknown>;
  const store = await getAccountingStore();
  const customerId = requiredText(body.customerId, "Müşteri");
  if (!store.customers.some((item) => item.id === customerId)) {
    throw new Error("Müşteri bulunamadı");
  }
  const kind = body.kind;
  if (!isCreditKind(kind)) throw new Error("Kayıt türü geçersiz");

  let productName = "";
  let vatRate: CreditEntry["vatRate"] = null;
  let paymentMethod: CreditEntry["paymentMethod"] = null;

  switch (kind) {
    case "purchase": {
      productName = requiredText(body.productName, "Ürün", 2);
      if (!isVatRate(body.vatRate)) {
        throw new Error("KDV oranı 1, 10 veya 20 olmalı");
      }
      vatRate = body.vatRate;
      break;
    }
    case "payment": {
      if (!isPaymentMethod(body.paymentMethod)) {
        throw new Error("Tahsilat nakit veya kart olmalı");
      }
      paymentMethod = body.paymentMethod;
      break;
    }
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }

  const entry: CreditEntry = {
    id: randomUUID(),
    customerId,
    kind,
    date: requiredDate(body.date),
    productName,
    amount: requiredAmount(body.amount, "Tutar"),
    vatRate,
    paymentMethod,
    note: asString(body.note).trim(),
    createdAt: new Date().toISOString(),
  };
  store.creditEntries = [entry, ...store.creditEntries];
  await saveAccountingStore(store);
  return store;
}

export async function deleteCreditEntry(id: string): Promise<AccountingStore> {
  const store = await getAccountingStore();
  const next = store.creditEntries.filter((item) => item.id !== id);
  if (next.length === store.creditEntries.length) {
    throw new Error("Kayıt bulunamadı");
  }
  store.creditEntries = next;
  await saveAccountingStore(store);
  return store;
}
