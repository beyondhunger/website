import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_req: NextRequest) {
  try {
    const existing = await prisma.service.findMany({
      orderBy: { price: "asc" }
    });

    if (existing.length > 0) {
      return NextResponse.json(existing, { status: 200 });
    }

    await prisma.service.createMany({
      data: [
        {
          name: "Photography",
          slug: "photography",
          description: "Essential portrait / event photography session.",
          price: 5000,
          currency: "GBP"
        },
        {
          name: "Reel",
          slug: "reel",
          description: "Short-form vertical video reel for socials.",
          price: 4000,
          currency: "GBP"
        },
        {
          name: "Photography & Reel",
          slug: "photography-reel",
          description: "Combined package: photos + reel in one booking.",
          price: 7000,
          currency: "GBP"
        }
      ],
      skipDuplicates: true
    });

    const services = await prisma.service.findMany({
      orderBy: { price: "asc" }
    });

    return NextResponse.json(services, { status: 200 });
  } catch (err) {
    console.error("GET /api/services error:", err);
    return NextResponse.json(
      { error: "Failed to load services" },
      { status: 500 }
    );
  }
}
