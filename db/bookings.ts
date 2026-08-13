export async function ensureBookingsTable() {
  const { env } = await import("cloudflare:workers");
  const d1 = env.DB;

  if (!d1) {
    throw new Error("Cloudflare D1 binding `DB` is unavailable.");
  }

  await d1.batch([
    d1.prepare(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        car TEXT NOT NULL,
        service TEXT NOT NULL,
        visit_date TEXT NOT NULL,
        visit_time TEXT NOT NULL,
        comment TEXT NOT NULL DEFAULT '',
        status TEXT NOT NULL DEFAULT 'new',
        source TEXT NOT NULL DEFAULT 'website',
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `),
    d1.prepare("CREATE INDEX IF NOT EXISTS bookings_created_at_idx ON bookings (created_at)"),
    d1.prepare("CREATE INDEX IF NOT EXISTS bookings_status_idx ON bookings (status)"),
  ]);
}
