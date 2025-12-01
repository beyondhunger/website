export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

const normalizePrice = (value: number) =>
  value < 10 ? value * 100 : value;

export async function POST(req: NextRequest) {
  try {
    const { userId, serviceId, date, location } = await req.json();

    if (!userId || !serviceId || !date || !location) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    // 1️⃣ Get service details (IMPORTANT)
    const service = await prisma.service.findUnique({
      where: { id: serviceId }
    });

    if (!service) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      );
    }

    // 2️⃣ Create booking
    const booking = await prisma.booking.create({
      data: {
        userId,
        serviceId,
        date,
        location
      }
    });

    const normalizedPrice = normalizePrice(service.price);

    // 3️⃣ Create payment entry with correct amount (Stripe expects minor units)
    await prisma.payment.create({
      data: {
        bookingId: booking.id,
        provider: "stripe",
        providerPaymentId: "",
        amount: Math.round(normalizedPrice * 100),
        currency: "GBP"
      }
    });

    return NextResponse.json({ booking });
  } catch (error) {
    console.error(error);
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
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: { service: true },
      orderBy: { date: "asc" }
    });

    const now = new Date();
    const formatted = bookings.map((booking) => ({
      id: booking.id,
      date: booking.date,
      location: booking.location,
      status: booking.status,
      service: {
        id: booking.service.id,
        name: booking.service.name
      }
    }));

    const previous = formatted.filter((booking) => new Date(booking.date) < now);
    const upcoming = formatted.filter((booking) => new Date(booking.date) >= now);

    return NextResponse.json({ previous, upcoming });
  } catch (error) {
    console.error("Failed to fetch bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
