"use client";

export const dynamic = "force-dynamic"; // Disable prerendering completely

import { Suspense } from "react";
import PaymentInner from "./PaymentInner";

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="p-5">Loading payment...</div>}>
      <PaymentInner />
    </Suspense>
  );
}
