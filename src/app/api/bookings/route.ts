export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

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

    // 3️⃣ Create payment entry with correct amount
    await prisma.payment.create({
      data: {
        bookingId: booking.id,
        provider: "stripe",
        providerPaymentId: "",
        amount: service.price,   //  <-- FIXED
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
