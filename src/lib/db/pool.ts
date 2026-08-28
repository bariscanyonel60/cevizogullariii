import mysql from "mysql2/promise";

let pool: mysql.Pool | null = null;

export function isDatabaseConfigured(): boolean {
  return Boolean(
    process.env.DATABASE_USER &&
      process.env.DATABASE_PASSWORD &&
      process.env.DATABASE_NAME,
  );
}

export function getPool(): mysql.Pool {
  if (!isDatabaseConfigured()) {
    throw new Error("MySQL ortam değişkenleri eksik");
  }
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DATABASE_HOST || "127.0.0.1",
      port: Number(process.env.DATABASE_PORT || 3306),
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      waitForConnections: true,
      connectionLimit: 5,
      dateStrings: true,
      charset: "utf8mb4",
    });
  }
  return pool;
}

export function toMysqlDateTime(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value.replace("T", " ").slice(0, 23);
  }
  return parsed.toISOString().slice(0, 23).replace("T", " ");
}

export function fromMysqlDateTime(value: string): string {
  if (value.includes("T")) return value;
  const parsed = new Date(`${value.replace(" ", "T")}Z`);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toISOString();
}
