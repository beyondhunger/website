export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest) {
  try {
    const existing = await prisma.service.findMany({
      orderBy: { price: "asc" }
    });

    return NextResponse.json(existing);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to load services" },
      { status: 500 }
    );
  }
}
