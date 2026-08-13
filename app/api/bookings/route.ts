import { getDb } from "../../../db";
import { ensureBookingsTable } from "../../../db/bookings";
import { bookings } from "../../../db/schema";

type BookingPayload = {
  name?: unknown;
  phone?: unknown;
  car?: unknown;
  service?: unknown;
  visitDate?: unknown;
  visitTime?: unknown;
  comment?: unknown;
  company?: unknown;
};

function clean(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as BookingPayload;

    if (clean(payload.company, 120)) {
      return Response.json({ accepted: true }, { status: 201 });
    }

    const name = clean(payload.name, 80);
    const phone = clean(payload.phone, 30);
    const car = clean(payload.car, 100);
    const service = clean(payload.service, 100);
    const visitDate = clean(payload.visitDate, 10);
    const visitTime = clean(payload.visitTime, 5);
    const comment = clean(payload.comment, 800);

    if (!name || !phone || !car || !service || !visitDate || !visitTime) {
      return Response.json(
        { error: "Заполните имя, телефон, автомобиль, услугу, дату и время." },
        { status: 400 },
      );
    }

    if (phone.replace(/\D/g, "").length < 10) {
      return Response.json(
        { error: "Проверьте номер телефона." },
        { status: 400 },
      );
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(visitDate) || !/^\d{2}:\d{2}$/.test(visitTime)) {
      return Response.json(
        { error: "Проверьте дату и время записи." },
        { status: 400 },
      );
    }

    await ensureBookingsTable();
    const db = await getDb();
    const [booking] = await db
      .insert(bookings)
      .values({ name, phone, car, service, visitDate, visitTime, comment })
      .returning({ id: bookings.id });

    return Response.json({ accepted: true, bookingId: booking.id }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    const cause =
      error instanceof Error && error.cause instanceof Error ? error.cause.message : "";
    const detail = `${message}${cause ? `\n${cause}` : ""}`;
    const unavailable = detail.includes("no such table") || detail.includes("D1 binding");

    console.error("booking_submission_failed", error);

    return Response.json(
      {
        error: unavailable
          ? "Сервис записи временно недоступен. Позвоните нам по номеру +7 916 504-21-01."
          : process.env.NODE_ENV === "development"
            ? detail
            : "Не удалось сохранить заявку. Попробуйте ещё раз или позвоните нам.",
      },
      { status: 500 },
    );
  }
}
