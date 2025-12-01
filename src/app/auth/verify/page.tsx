"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function VerifyContent() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("Please use the verification link sent to your email.");

  useEffect(() => {
    if (!token) return;

    async function verify() {
      try {
        const res = await fetch("/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token })
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Verification failed");
        }
        setStatus("success");
        setMessage("Email verified! You can login now.");
        setTimeout(() => router.push("/auth/login"), 1500);
      } catch (err) {
        console.error(err);
        setStatus("error");
        setMessage(err instanceof Error ? err.message : "Verification failed");
      }
    }

    verify();
  }, [token, router]);

  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center bg-white px-4 text-center">
      <div className="w-full max-w-md rounded-3xl border border-neutral-200 p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-neutral-900">Verify your email</h1>
        <p className="mt-2 text-sm text-neutral-600">{message}</p>

        {status === "idle" && token && (
          <p className="mt-6 text-sm text-neutral-500">Verifying token...</p>
        )}
        {status === "success" && (
          <p className="mt-6 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
            Great! Redirecting you to login.
          </p>
        )}
        {status === "error" && (
          <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {message}
          </p>
        )}
      </div>
    </section>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <section className="flex min-h-[60vh] items-center justify-center bg-white px-4">
          <p className="text-sm text-neutral-600">Loading verification...</p>
        </section>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
