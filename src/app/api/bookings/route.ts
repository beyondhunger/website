import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { userId, serviceId, date, location } = body as {
      userId?: string;
      serviceId?: string;
      date?: string;
      location?: string;
    };

    if (!userId || !serviceId || !date || !location) {
      return NextResponse.json(
        { error: "userId, serviceId, date and location are required" },
        { status: 400 }
      );
    }

    const service = await prisma.service.findUnique({
      where: { id: serviceId }
    });

    if (!service) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      );
    }

    const bookingDate = new Date(date);

    const booking = await prisma.booking.create({
      data: {
        userId,
        serviceId,
        date: bookingDate,
        location
      },
      include: {
        service: true
      }
    });

    return NextResponse.json(
      {
        booking,
        message: "Booking created with status PENDING_PAYMENT"
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/bookings error:", err);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId query param is required" },
        { status: 400 }
      );
    }

    const bookings = await prisma.booking.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      include: { service: true }
    });

    return NextResponse.json(bookings, { status: 200 });
  } catch (err) {
    console.error("GET /api/bookings error:", err);
    return NextResponse.json(
      { error: "Failed to load bookings" },
      { status: 500 }
    );
  }
}
