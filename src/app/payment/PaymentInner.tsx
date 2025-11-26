"use client";

import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Load Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
    process.env.STRIPE_PUBLISHABLE_KEY ||
    ""
);

type LoggedInUser = {
  id: string;
  email: string;
  name?: string | null;
};

// ======================================================================
// PaymentForm Component
// ======================================================================
function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const searchParams = useSearchParams();
  const router = useRouter();

  const bookingId = searchParams.get("bookingId");

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [user, setUser] = useState<LoggedInUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load user from localStorage
  useEffect(() => {
    const raw = window.localStorage.getItem("bh_user");
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {
        // ignore
      }
    }
  }, []);

  // Create Payment Intent
  useEffect(() => {
    async function createIntent() {
      if (!bookingId) {
        setError("Invalid booking. Please go back and try again.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/payments/create-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingId }),
        });

        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Failed to start payment");
        } else {
          setClientSecret(data.clientSecret);
        }
      } catch (err) {
        console.error(err);
        setError("Something went wrong while preparing payment.");
      } finally {
        setLoading(false);
      }
    }

    createIntent();
  }, [bookingId]);

  // Handle Payment Submit
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!stripe || !elements) return;
    if (!clientSecret) {
      setError("Payment is not ready yet.");
      return;
    }
    if (!user) {
      setError("Please login before paying.");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError("Card element not available.");
      return;
    }

    try {
      setSubmitting(true);

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            email: user.email,
            name: user.name ?? undefined,
          },
        },
      });

      if (result.error) {
        console.error(result.error);
        setError(result.error.message || "Payment failed");
      } else if (result.paymentIntent?.status === "succeeded") {
        await fetch("/api/payments/mark-paid", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingId }),
        });

        setSuccess("Payment successful! Your booking is confirmed.");
        setTimeout(() => router.push("/"), 2000);
      } else {
        setError("Payment did not succeed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong while processing payment.");
    } finally {
      setSubmitting(false);
    }
  }

  // UI states
  if (loading) {
    return (
      <p className="mt-6 text-sm text-neutral-500">
        Preparing secure payment...
      </p>
    );
  }

  if (!bookingId) {
    return (
      <p className="mt-6 text-sm text-red-600">
        Missing booking. Please go back to Services page.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      <div className="rounded-xl border border-neutral-200 bg-white p-4">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
              },
            },
          }}
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-600">{success}</p>}

      <button
        type="submit"
        disabled={submitting || !stripe || !elements}
        className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
      >
        {submitting ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
}

// ======================================================================
// Payment Page Inner Wrapper
// ======================================================================
export default function PaymentInner() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-md px-4 py-16">
        <h1 className="text-3xl font-bold text-neutral-900">Payment</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Enter your card details to complete your booking.
        </p>

        {!stripePromise && (
          <p className="mt-4 text-sm text-red-600">
            Stripe publishable key is not configured.
          </p>
        )}

        {stripePromise && (
          <Elements stripe={stripePromise}>
            <PaymentForm />
          </Elements>
        )}
      </div>
    </section>
  );
}
