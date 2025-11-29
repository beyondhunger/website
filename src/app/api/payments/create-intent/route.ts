export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";

const normalizePrice = (value: number) =>
  value < 10 ? value * 100 : value;

export async function POST(req: NextRequest) {
  try {
    const { bookingId } = await req.json();

    if (!bookingId) {
      return NextResponse.json(
        { error: "Missing bookingId" },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { service: true },
    });

    if (!booking || !booking.service) {
      return NextResponse.json(
        { error: "Booking or service not found" },
        { status: 404 }
      );
    }

    const normalizedPrice = normalizePrice(booking.service.price);

    const intent = await stripe.paymentIntents.create({
      amount: Math.round(normalizedPrice * 100),
      currency: "GBP",
      metadata: {
        bookingId: booking.id,
      },
    });

    await prisma.payment.update({
      where: { bookingId: booking.id },
      data: { providerPaymentId: intent.id },
    });

    return NextResponse.json({
      clientSecret: intent.client_secret,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}
