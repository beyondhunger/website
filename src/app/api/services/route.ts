export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest) {
  try {
    // 🔍 DEBUG LINE — prints whether Prisma loaded properly
    console.log("DEBUG: prisma.service =", prisma?.service);

    const existing = await prisma.service.findMany({
      orderBy: { price: "asc" },
    });

    return NextResponse.json(existing);
  } catch (error) {
    console.error("🔥 ERROR IN /api/services:", error);
    return NextResponse.json(
      { error: "Failed to load services" },
      { status: 500 }
    );
  }
}
