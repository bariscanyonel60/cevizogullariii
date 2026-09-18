import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { getPool, fromMysqlDateTime, toMysqlDateTime } from "@/lib/db/pool";
import {
  isCreditKind,
  isExpenseCategory,
  isIsoDate,
  isPaymentMethod,
  isSaleKind,
  isVatRate,
  type AccountingStore,
  type Advance,
  type CreditEntry,
  type Customer,
  type Expense,
  type Sale,
  type SaleKind,
  type StaffMember,
} from "@/lib/accounting-types";

type SaleRow = RowDataPacket & {
  id: string;
  date: string;
  kind?: string | null;
  exchange_refund?: number | boolean | null;
  product_name: string;
  quantity: string | number;
  unit_price: string | number;
  vat_rate: number;
  payment_method: string;
  note: string;
  created_at: string;
};

type StaffRow = RowDataPacket & {
  id: string;
  name: string;
  created_at: string;
};

type AdvanceRow = RowDataPacket & {
  id: string;
  staff_id: string;
  date: string;
  amount: string | number;
  note: string;
  created_at: string;
};

type CustomerRow = RowDataPacket & {
  id: string;
  first_name: string;
  last_name: string;
  tc: string | null;
  address: string;
  phone: string;
  created_at: string;
};

type CreditRow = RowDataPacket & {
  id: string;
  customer_id: string;
  kind: string;
  date: string;
  due_date: string | null;
  product_name: string;
  quantity?: string | number | null;
  unit?: string | null;
  amount: string | number;
  vat_rate: number | null;
  payment_method: string | null;
  note: string;
  created_at: string;
};

type ExpenseRow = RowDataPacket & {
  id: string;
  date: string;
  category: string;
  title: string;
  amount: string | number;
  vat_rate: number | null;
  payment_method: string;
  note: string;
  created_at: string;
};

function asNumber(value: string | number): number {
  return typeof value === "number" ? value : Number(value);
}

function mapSale(row: SaleRow): Sale | null {
  const vatRate = Number(row.vat_rate);
  if (!isVatRate(vatRate) || !isPaymentMethod(row.payment_method)) {
    return null;
  }
  const kind: SaleKind = isSaleKind(row.kind) ? row.kind : "sale";
  return {
    id: row.id,
    date: row.date,
    kind,
    exchangeRefund:
      kind === "exchange"
        ? Boolean(row.exchange_refund === 1 || row.exchange_refund === true)
        : false,
    productName: row.product_name,
    quantity: asNumber(row.quantity),
    unitPrice: asNumber(row.unit_price),
    vatRate,
    paymentMethod: row.payment_method,
    note: row.note,
    createdAt: fromMysqlDateTime(row.created_at),
  };
}

function mapStaff(row: StaffRow): StaffMember {
  return { id: row.id, name: row.name, createdAt: fromMysqlDateTime(row.created_at) };
}

function mapAdvance(row: AdvanceRow): Advance {
  return {
    id: row.id,
    staffId: row.staff_id,
    date: row.date,
    amount: asNumber(row.amount),
    note: row.note,
    createdAt: fromMysqlDateTime(row.created_at),
  };
}

function mapCustomer(row: CustomerRow): Customer {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    tc: (row.tc ?? "").trim(),
    address: row.address,
    phone: row.phone,
    createdAt: fromMysqlDateTime(row.created_at),
  };
}

function asIsoDate(value: string | null | undefined): string | null {
  if (!value) return null;
  const iso = value.slice(0, 10);
  return isIsoDate(iso) ? iso : null;
}

function isDuplicateColumnError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const item = error as { errno?: number; code?: string };
  return item.errno === 1060 || item.code === "ER_DUP_FIELDNAME";
}

function mapCredit(row: CreditRow): CreditEntry | null {
  if (!isCreditKind(row.kind)) return null;
  const vatRate =
    row.vat_rate === null || row.vat_rate === undefined
      ? null
      : Number(row.vat_rate);
  const paymentMethod = row.payment_method;
  if (vatRate !== null && !isVatRate(vatRate)) return null;
  if (paymentMethod !== null && !isPaymentMethod(paymentMethod)) return null;
  const rawQty =
    row.quantity === null || row.quantity === undefined || row.quantity === ""
      ? null
      : asNumber(row.quantity);
  const quantity =
    row.kind === "purchase" &&
    rawQty !== null &&
    Number.isFinite(rawQty) &&
    rawQty > 0
      ? rawQty
      : null;
  return {
    id: row.id,
    customerId: row.customer_id,
    kind: row.kind,
    date: row.date,
    dueDate: row.kind === "purchase" ? asIsoDate(row.due_date) : null,
    productName: row.product_name,
    quantity,
    unit: row.kind === "purchase" ? (row.unit ?? "").trim().slice(0, 32) : "",
    amount: asNumber(row.amount),
    vatRate,
    paymentMethod,
    note: row.note,
    createdAt: fromMysqlDateTime(row.created_at),
  };
}

function mapExpense(row: ExpenseRow): Expense | null {
  if (!isExpenseCategory(row.category) || !isPaymentMethod(row.payment_method)) {
    return null;
  }
  const vatRate =
    row.vat_rate === null || row.vat_rate === undefined
      ? null
      : Number(row.vat_rate);
  if (vatRate !== null && !isVatRate(vatRate)) return null;
  return {
    id: row.id,
    date: row.date,
    category: row.category,
    title: row.title,
    amount: asNumber(row.amount),
    vatRate,
    paymentMethod: row.payment_method,
    note: row.note,
    createdAt: fromMysqlDateTime(row.created_at),
  };
}

export async function readAccountingFromMysql(): Promise<AccountingStore> {
  await ensureAccountingSchema();
  const pool = getPool();
  const [salesRows] = await pool.query<SaleRow[]>(
    "SELECT * FROM sales ORDER BY created_at DESC",
  );
  const [staffRows] = await pool.query<StaffRow[]>(
    "SELECT * FROM staff ORDER BY created_at DESC",
  );
  const [advanceRows] = await pool.query<AdvanceRow[]>(
    "SELECT * FROM advances ORDER BY created_at DESC",
  );
  const [customerRows] = await pool.query<CustomerRow[]>(
    "SELECT * FROM customers ORDER BY last_name ASC, first_name ASC",
  );
  const [creditRows] = await pool.query<CreditRow[]>(
    "SELECT * FROM credit_entries ORDER BY created_at DESC",
  );
  const [expenseRows] = await pool.query<ExpenseRow[]>(
    "SELECT * FROM expenses ORDER BY created_at DESC",
  );

  return {
    sales: salesRows.map(mapSale).filter((item): item is Sale => item !== null),
    staff: staffRows.map(mapStaff),
    advances: advanceRows.map(mapAdvance),
    customers: customerRows.map(mapCustomer),
    creditEntries: creditRows
      .map(mapCredit)
      .filter((item): item is CreditEntry => item !== null),
    expenses: expenseRows
      .map(mapExpense)
      .filter((item): item is Expense => item !== null),
  };
}

let schemaPromise: Promise<void> | null = null;

async function ensureAccountingSchema(): Promise<void> {
  if (!schemaPromise) {
    schemaPromise = (async () => {
      const pool = getPool();
      await pool.query("ALTER TABLE customers MODIFY tc VARCHAR(64) NULL");
      await pool.query(
        "UPDATE customers SET tc = NULL WHERE tc IS NOT NULL AND TRIM(tc) = ''",
      );
      await pool.query(
        "ALTER TABLE sales MODIFY payment_method ENUM('nakit', 'kart', 'havale') NOT NULL",
      );
      await pool.query(
        "ALTER TABLE credit_entries MODIFY payment_method ENUM('nakit', 'kart', 'havale') NULL",
      );
      try {
        await pool.query(
          "ALTER TABLE sales ADD COLUMN kind ENUM('sale', 'return', 'exchange') NOT NULL DEFAULT 'sale' AFTER date",
        );
      } catch (error) {
        if (!isDuplicateColumnError(error)) throw error;
      }
      try {
        await pool.query(
          "ALTER TABLE sales ADD COLUMN exchange_refund TINYINT(1) NOT NULL DEFAULT 0 AFTER kind",
        );
      } catch (error) {
        if (!isDuplicateColumnError(error)) throw error;
      }
      try {
        await pool.query(
          "ALTER TABLE credit_entries ADD COLUMN due_date DATE NULL AFTER date",
        );
      } catch (error) {
        if (!isDuplicateColumnError(error)) throw error;
      }
      try {
        await pool.query(
          "ALTER TABLE credit_entries ADD COLUMN quantity DECIMAL(12, 3) NULL AFTER product_name",
        );
      } catch (error) {
        if (!isDuplicateColumnError(error)) throw error;
      }
      try {
        await pool.query(
          "ALTER TABLE credit_entries ADD COLUMN unit VARCHAR(32) NOT NULL DEFAULT '' AFTER quantity",
        );
      } catch (error) {
        if (!isDuplicateColumnError(error)) throw error;
      }
      await pool.query(`
        CREATE TABLE IF NOT EXISTS expenses (
          id CHAR(36) NOT NULL PRIMARY KEY,
          date DATE NOT NULL,
          category ENUM('kira', 'elektrik', 'su', 'yakit', 'tedarik', 'bakim', 'diger') NOT NULL,
          title VARCHAR(255) NOT NULL,
          amount DECIMAL(12, 3) NOT NULL,
          vat_rate TINYINT NULL,
          payment_method ENUM('nakit', 'kart', 'havale') NOT NULL,
          note TEXT NOT NULL,
          created_at DATETIME(3) NOT NULL,
          INDEX idx_expenses_date (date),
          INDEX idx_expenses_created (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
    })().catch((error) => {
      schemaPromise = null;
      throw error;
    });
  }
  await schemaPromise;
}

export async function writeAccountingToMysql(
  store: AccountingStore,
): Promise<void> {
  await ensureAccountingSchema();
  const pool = getPool();
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query("DELETE FROM credit_entries");
    await conn.query("DELETE FROM advances");
    await conn.query("DELETE FROM sales");
    await conn.query("DELETE FROM expenses");
    await conn.query("DELETE FROM customers");
    await conn.query("DELETE FROM staff");

    for (const item of store.staff) {
      await conn.query<ResultSetHeader>(
        "INSERT INTO staff (id, name, created_at) VALUES (?, ?, ?)",
        [item.id, item.name, toMysqlDateTime(item.createdAt)],
      );
    }
    for (const item of store.sales) {
      await conn.query<ResultSetHeader>(
        `INSERT INTO sales
          (id, date, kind, exchange_refund, product_name, quantity, unit_price, vat_rate, payment_method, note, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          item.id,
          item.date,
          item.kind,
          item.exchangeRefund ? 1 : 0,
          item.productName,
          item.quantity,
          item.unitPrice,
          item.vatRate,
          item.paymentMethod,
          item.note,
          toMysqlDateTime(item.createdAt),
        ],
      );
    }
    for (const item of store.customers) {
      await conn.query<ResultSetHeader>(
        `INSERT INTO customers
          (id, first_name, last_name, tc, address, phone, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          item.id,
          item.firstName,
          item.lastName,
          item.tc.trim() || null,
          item.address,
          item.phone,
          toMysqlDateTime(item.createdAt),
        ],
      );
    }
    for (const item of store.advances) {
      await conn.query<ResultSetHeader>(
        `INSERT INTO advances
          (id, staff_id, date, amount, note, created_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          item.id,
          item.staffId,
          item.date,
          item.amount,
          item.note,
          toMysqlDateTime(item.createdAt),
        ],
      );
    }
    for (const item of store.creditEntries) {
      await conn.query<ResultSetHeader>(
        `INSERT INTO credit_entries
          (id, customer_id, kind, date, due_date, product_name, quantity, unit, amount, vat_rate, payment_method, note, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          item.id,
          item.customerId,
          item.kind,
          item.date,
          item.kind === "purchase" ? item.dueDate : null,
          item.productName,
          item.kind === "purchase" ? item.quantity : null,
          item.kind === "purchase" ? item.unit : "",
          item.amount,
          item.vatRate,
          item.paymentMethod,
          item.note,
          toMysqlDateTime(item.createdAt),
        ],
      );
    }
    for (const item of store.expenses ?? []) {
      await conn.query<ResultSetHeader>(
        `INSERT INTO expenses
          (id, date, category, title, amount, vat_rate, payment_method, note, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          item.id,
          item.date,
          item.category,
          item.title,
          item.amount,
          item.vatRate,
          item.paymentMethod,
          item.note,
          toMysqlDateTime(item.createdAt),
        ],
      );
    }

    await conn.commit();
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}
