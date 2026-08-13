import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const bookings = sqliteTable(
  "bookings",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    phone: text("phone").notNull(),
    car: text("car").notNull(),
    service: text("service").notNull(),
    visitDate: text("visit_date").notNull(),
    visitTime: text("visit_time").notNull(),
    comment: text("comment").notNull().default(""),
    status: text("status").notNull().default("new"),
    source: text("source").notNull().default("website"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("bookings_created_at_idx").on(table.createdAt),
    index("bookings_status_idx").on(table.status),
  ],
);
