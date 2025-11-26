import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { paymentIntentId, bookingId } = await req.json();

    if (!paymentIntentId || !bookingId) {
      return NextResponse.json(
        { error: "Missing paymentIntentId or bookingId" },
        { status: 400 }
      );
    }

    // Update Payment using bookingId (unique field)
    await prisma.payment.update({
      where: { bookingId: bookingId },
      data: {
        providerPaymentId: paymentIntentId, // store intent ID here
        status: "SUCCEEDED",
      },
    });

    // Update Booking
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: "CONFIRMED",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error updating payment status" },
      { status: 500 }
    );
  }
}
