import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { getPool, fromMysqlDateTime, toMysqlDateTime } from "@/lib/db/pool";
import {
  isCreditKind,
  isPaymentMethod,
  isVatRate,
  type AccountingStore,
  type Advance,
  type CreditEntry,
  type Customer,
  type Sale,
  type StaffMember,
} from "@/lib/accounting-types";

type SaleRow = RowDataPacket & {
  id: string;
  date: string;
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
  tc: string;
  address: string;
  phone: string;
  created_at: string;
};

type CreditRow = RowDataPacket & {
  id: string;
  customer_id: string;
  kind: string;
  date: string;
  product_name: string;
  amount: string | number;
  vat_rate: number | null;
  payment_method: string | null;
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
  return {
    id: row.id,
    date: row.date,
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
    tc: row.tc,
    address: row.address,
    phone: row.phone,
    createdAt: fromMysqlDateTime(row.created_at),
  };
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
  return {
    id: row.id,
    customerId: row.customer_id,
    kind: row.kind,
    date: row.date,
    productName: row.product_name,
    amount: asNumber(row.amount),
    vatRate,
    paymentMethod,
    note: row.note,
    createdAt: fromMysqlDateTime(row.created_at),
  };
}

export async function readAccountingFromMysql(): Promise<AccountingStore> {
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
    "SELECT * FROM customers ORDER BY created_at DESC",
  );
  const [creditRows] = await pool.query<CreditRow[]>(
    "SELECT * FROM credit_entries ORDER BY created_at DESC",
  );

  return {
    sales: salesRows.map(mapSale).filter((item): item is Sale => item !== null),
    staff: staffRows.map(mapStaff),
    advances: advanceRows.map(mapAdvance),
    customers: customerRows.map(mapCustomer),
    creditEntries: creditRows
      .map(mapCredit)
      .filter((item): item is CreditEntry => item !== null),
  };
}

export async function writeAccountingToMysql(
  store: AccountingStore,
): Promise<void> {
  const pool = getPool();
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query("DELETE FROM credit_entries");
    await conn.query("DELETE FROM advances");
    await conn.query("DELETE FROM sales");
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
          (id, date, product_name, quantity, unit_price, vat_rate, payment_method, note, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          item.id,
          item.date,
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
          item.tc,
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
          (id, customer_id, kind, date, product_name, amount, vat_rate, payment_method, note, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          item.id,
          item.customerId,
          item.kind,
          item.date,
          item.productName,
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
