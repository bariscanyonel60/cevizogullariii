import { createCipheriv, createDecipheriv, createHash, randomBytes, randomUUID } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { get, put } from "@vercel/blob";
import { dayCashSummary, monthCashSummary, parseMoneyInput } from "@/lib/accounting-money";
import {
  readAccountingFromMysql,
  writeAccountingToMysql,
} from "@/lib/db/accounting-sql";
import { isDatabaseConfigured } from "@/lib/db/pool";
import {
  CASH_ZERO_MONTH_NOTE,
  CASH_ZERO_NOTE,
  CASH_ZERO_TITLE,
  emptyAccountingStore,
  isCashZeroScope,
  isCreditKind,
  isExpenseCategory,
  isIsoDate,
  isPaymentMethod,
  isSaleKind,
  isValidPhone,
  isVatRate,
  type AccountingStore,
  type Advance,
  type CreditEntry,
  type Customer,
  type Expense,
  type Sale,
  type SaleKind,
  type StaffMember,
  sortCustomersByName,
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
    sales: Array.isArray(record.sales)
      ? record.sales.filter(isSale).map(normalizeSale)
      : [],
    staff: Array.isArray(record.staff) ? record.staff.filter(isStaff) : [],
    advances: Array.isArray(record.advances)
      ? record.advances.filter(isAdvance)
      : [],
    customers: Array.isArray(record.customers)
      ? sortCustomersByName(record.customers.filter(isCustomer))
      : [],
    creditEntries: Array.isArray(record.creditEntries)
      ? record.creditEntries.filter(isCreditEntry).map(normalizeCreditEntry)
      : [],
    expenses: Array.isArray(record.expenses)
      ? record.expenses.filter(isExpense)
      : [],
  };
}

function normalizeSale(item: Sale): Sale {
  const kind: SaleKind = isSaleKind(item.kind) ? item.kind : "sale";
  return {
    ...item,
    kind,
    exchangeRefund: kind === "exchange" ? Boolean(item.exchangeRefund) : false,
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

function normalizeCreditEntry(item: CreditEntry): CreditEntry {
  const dueDate =
    item.kind === "purchase" &&
    typeof item.dueDate === "string" &&
    isIsoDate(item.dueDate)
      ? item.dueDate
      : null;
  const quantity =
    item.kind === "purchase" &&
    typeof item.quantity === "number" &&
    Number.isFinite(item.quantity) &&
    item.quantity > 0
      ? Math.round(item.quantity * 1000) / 1000
      : null;
  const unit =
    item.kind === "purchase" && typeof item.unit === "string"
      ? item.unit.trim().slice(0, 32)
      : "";
  return { ...item, dueDate, quantity, unit };
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

function isExpense(value: unknown): value is Expense {
  if (!value || typeof value !== "object") return false;
  const item = value as Expense;
  const vatOk = item.vatRate === null || isVatRate(item.vatRate);
  return (
    typeof item.id === "string" &&
    isIsoDate(item.date) &&
    isExpenseCategory(item.category) &&
    typeof item.title === "string" &&
    Number.isFinite(item.amount) &&
    vatOk &&
    isPaymentMethod(item.paymentMethod)
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
  const amount =
    typeof value === "string" ? parseMoneyInput(value) : asNumber(value);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error(`${label} 0’dan büyük olmalı`);
  }
  return Math.round(amount * 1000) / 1000;
}

export async function createSale(input: unknown): Promise<AccountingStore> {
  const fields = parseSaleFields((input ?? {}) as Record<string, unknown>);
  const sale: Sale = {
    id: randomUUID(),
    ...fields,
    createdAt: new Date().toISOString(),
  };

  const store = await getAccountingStore();
  store.sales = [sale, ...store.sales];
  await saveAccountingStore(store);
  return store;
}

function parseSaleFields(body: Record<string, unknown>) {
  const vatRate = body.vatRate;
  const paymentMethod = body.paymentMethod;
  if (!isVatRate(vatRate)) throw new Error("KDV oranı 1, 10 veya 20 olmalı");
  if (!isPaymentMethod(paymentMethod)) {
    throw new Error("Ödeme nakit, kart veya havale olmalı");
  }
  const kind: SaleKind = isSaleKind(body.kind) ? body.kind : "sale";
  const exchangeRefund =
    kind === "exchange" ? Boolean(body.exchangeRefund) : false;
  return {
    date: requiredDate(body.date),
    kind,
    exchangeRefund,
    productName: requiredText(body.productName, "Ürün", 2),
    quantity: requiredAmount(body.quantity, "Adet"),
    unitPrice: requiredAmount(
      body.unitPrice,
      kind === "exchange" ? "Fark tutarı" : "Birim fiyat",
    ),
    vatRate,
    paymentMethod,
    note: asString(body.note).trim(),
  };
}

export async function updateSale(
  id: string,
  input: unknown,
): Promise<AccountingStore> {
  const fields = parseSaleFields((input ?? {}) as Record<string, unknown>);
  const store = await getAccountingStore();
  const index = store.sales.findIndex((item) => item.id === id);
  if (index === -1) throw new Error("Satış bulunamadı");
  store.sales[index] = {
    ...store.sales[index],
    ...fields,
  };
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

function optionalTc(value: unknown): string {
  return asString(value).trim().slice(0, 64);
}

function parseCustomerFields(body: Record<string, unknown>) {
  const firstName = requiredText(body.firstName, "Ad", 2);
  const lastName = requiredText(body.lastName, "Soyad", 2);
  const tc = optionalTc(body.tc);
  const phone = requiredText(body.phone, "Telefon", 10);
  if (!isValidPhone(phone)) throw new Error("Telefon geçersiz");
  const address = requiredText(body.address, "Adres", 5);
  return { firstName, lastName, tc, phone, address };
}

export async function createCustomer(input: unknown): Promise<AccountingStore> {
  const fields = parseCustomerFields((input ?? {}) as Record<string, unknown>);
  const store = await getAccountingStore();
  if (
    fields.tc &&
    store.customers.some((item) => item.tc === fields.tc)
  ) {
    throw new Error("Bu T.C. kimlik no ile kayıtlı müşteri var");
  }
  const customer: Customer = {
    id: randomUUID(),
    ...fields,
    createdAt: new Date().toISOString(),
  };
  store.customers = sortCustomersByName([customer, ...store.customers]);
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
    fields.tc &&
    store.customers.some((item) => item.tc === fields.tc && item.id !== id)
  ) {
    throw new Error("Bu T.C. kimlik no ile kayıtlı başka müşteri var");
  }
  store.customers[index] = {
    ...store.customers[index],
    ...fields,
  };
  store.customers = sortCustomersByName(store.customers);
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
  const fields = parseCreditEntryFields(body, customerId);
  const entry: CreditEntry = {
    id: randomUUID(),
    ...fields,
    createdAt: new Date().toISOString(),
  };
  store.creditEntries = [entry, ...store.creditEntries];
  await saveAccountingStore(store);
  return store;
}

function parseCreditEntryFields(
  body: Record<string, unknown>,
  customerId: string,
) {
  const kind = body.kind;
  if (!isCreditKind(kind)) throw new Error("Kayıt türü geçersiz");

  let productName = "";
  let quantity: number | null = null;
  let unit = "";
  let vatRate: CreditEntry["vatRate"] = null;
  let paymentMethod: CreditEntry["paymentMethod"] = null;
  let dueDate: string | null = null;
  const date = requiredDate(body.date);

  switch (kind) {
    case "purchase": {
      productName = requiredText(body.productName, "Ürün", 2);
      if (!isVatRate(body.vatRate)) {
        throw new Error("KDV oranı 1, 10 veya 20 olmalı");
      }
      vatRate = body.vatRate;
      dueDate = optionalIsoDate(body.dueDate);
      if (dueDate && dueDate < date) {
        throw new Error("Vade, satış tarihinden önce olamaz");
      }
      quantity = optionalQuantity(body.quantity);
      unit = optionalUnit(body.unit);
      break;
    }
    case "payment": {
      if (!isPaymentMethod(body.paymentMethod)) {
        throw new Error("Tahsilat nakit, kart veya havale olmalı");
      }
      paymentMethod = body.paymentMethod;
      break;
    }
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }

  return {
    customerId,
    kind,
    date,
    dueDate,
    productName,
    quantity,
    unit,
    amount: requiredAmount(body.amount, "Tutar"),
    vatRate,
    paymentMethod,
    note: asString(body.note).trim(),
  };
}

export async function updateCreditEntry(
  id: string,
  input: unknown,
): Promise<AccountingStore> {
  const body = (input ?? {}) as Record<string, unknown>;
  const store = await getAccountingStore();
  const index = store.creditEntries.findIndex((item) => item.id === id);
  if (index === -1) throw new Error("Kayıt bulunamadı");
  const existing = store.creditEntries[index];
  const customerId =
    asString(body.customerId).trim() || existing.customerId;
  if (!store.customers.some((item) => item.id === customerId)) {
    throw new Error("Müşteri bulunamadı");
  }
  const fields = parseCreditEntryFields(
    { ...body, kind: body.kind ?? existing.kind },
    customerId,
  );
  store.creditEntries[index] = {
    ...existing,
    ...fields,
  };
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

function optionalIsoDate(value: unknown): string | null {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value !== "string" || !isIsoDate(value)) {
    throw new Error("Vade tarihi geçersiz");
  }
  return value;
}

function optionalQuantity(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const amount =
    typeof value === "string" ? parseMoneyInput(value) : asNumber(value);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Adet / miktar 0’dan büyük olmalı");
  }
  return Math.round(amount * 1000) / 1000;
}

function optionalUnit(value: unknown): string {
  return asString(value).trim().slice(0, 32);
}

function optionalVatRate(value: unknown): Expense["vatRate"] {
  if (value === null || value === undefined || value === "") return null;
  if (!isVatRate(value)) throw new Error("KDV oranı 1, 10 veya 20 olmalı");
  return value;
}

export async function createCashZero(input: unknown): Promise<AccountingStore> {
  const body = (input ?? {}) as Record<string, unknown>;
  const date = requiredDate(body.date);
  const scope = isCashZeroScope(body.scope) ? body.scope : "day";
  const store = await getAccountingStore();
  let net = 0;
  switch (scope) {
    case "day":
      net = dayCashSummary(store, date).cashNet;
      break;
    case "month":
      net = monthCashSummary(store, date.slice(0, 7)).cashNet;
      break;
    default: {
      const _exhaustive: never = scope;
      return _exhaustive;
    }
  }
  if (net <= 0) {
    throw new Error("Sıfırlanacak nakit kasa yok");
  }

  const expense: Expense = {
    id: randomUUID(),
    date,
    category: "diger",
    title: CASH_ZERO_TITLE,
    amount: net,
    vatRate: null,
    paymentMethod: "nakit",
    note: scope === "month" ? CASH_ZERO_MONTH_NOTE : CASH_ZERO_NOTE,
    createdAt: new Date().toISOString(),
  };
  store.expenses = [expense, ...(store.expenses ?? [])];
  await saveAccountingStore(store);
  return store;
}

export async function createExpense(input: unknown): Promise<AccountingStore> {
  const body = (input ?? {}) as Record<string, unknown>;
  const category = body.category;
  const paymentMethod = body.paymentMethod;
  if (!isExpenseCategory(category)) throw new Error("Gider kategorisi geçersiz");
  if (!isPaymentMethod(paymentMethod)) {
    throw new Error("Ödeme nakit, kart veya havale olmalı");
  }

  const expense: Expense = {
    id: randomUUID(),
    date: requiredDate(body.date),
    category,
    title: requiredText(body.title, "Açıklama", 2),
    amount: requiredAmount(body.amount, "Tutar"),
    vatRate: optionalVatRate(body.vatRate),
    paymentMethod,
    note: asString(body.note).trim(),
    createdAt: new Date().toISOString(),
  };

  const store = await getAccountingStore();
  store.expenses = [expense, ...(store.expenses ?? [])];
  await saveAccountingStore(store);
  return store;
}

export async function deleteExpense(id: string): Promise<AccountingStore> {
  const store = await getAccountingStore();
  const next = store.expenses.filter((item) => item.id !== id);
  if (next.length === store.expenses.length) throw new Error("Gider bulunamadı");
  store.expenses = next;
  await saveAccountingStore(store);
  return store;
}
