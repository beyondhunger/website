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
