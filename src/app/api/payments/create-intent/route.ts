import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bookingId } = body as { bookingId?: string };

    if (!bookingId) {
      return NextResponse.json(
        { error: "bookingId is required" },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { service: true, payment: true }
    });

    if (!booking || !booking.service) {
      return NextResponse.json(
        { error: "Booking or service not found" },
        { status: 404 }
      );
    }

    const amount = booking.service.price;
    const currency = booking.service.currency.toLowerCase();

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: {
        bookingId: booking.id,
        serviceName: booking.service.name
      }
    });

    await prisma.payment.upsert({
      where: { bookingId: booking.id },
      update: {
        provider: "stripe",
        providerPaymentId: paymentIntent.id,
        amount,
        currency: booking.service.currency,
        status: "PENDING"
      },
      create: {
        bookingId: booking.id,
        provider: "stripe",
        providerPaymentId: paymentIntent.id,
        amount,
        currency: booking.service.currency,
        status: "PENDING"
      }
    });

    return NextResponse.json(
      { clientSecret: paymentIntent.client_secret },
      { status: 200 }
    );
  } catch (err) {
    console.error("POST /api/payments/create-intent error:", err);
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}
