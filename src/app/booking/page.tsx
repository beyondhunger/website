"use client";

import { Suspense } from "react";
import BookingInner from "./BookingInner";

export default function BookingPage() {
  return (
    <Suspense fallback={<div>Loading booking...</div>}>
      <BookingInner />
    </Suspense>
  );
}
