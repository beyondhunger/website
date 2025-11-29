"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const formatPrice = (value: number) => {
  const normalized = value < 1 ? value * 100 : value;
  return Number.isInteger(normalized)
    ? normalized.toString()
    : normalized.toFixed(2);
};

type Service = {
  id: string;
  name: string;
  description: string | null;
  price: number; // normalize before display/payment
  currency: string;
};

type LoggedInUser = {
  id: string;
  email: string;
  name?: string | null;
};

export default function BookingInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const serviceId = searchParams.get("serviceId");

  const [service, setService] = useState<Service | null>(null);
  const [user, setUser] = useState<LoggedInUser | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [loadingService, setLoadingService] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const raw = window.localStorage.getItem("bh_user");
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as LoggedInUser;
        setUser(parsed);
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    async function loadService() {
      if (!serviceId) {
        setError("No service selected. Please go back to Services.");
        setLoadingService(false);
        return;
      }

      try {
        const res = await fetch("/api/services");
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Failed to load service");
        } else {
          const found = (data as Service[]).find((s) => s.id === serviceId);
          if (!found) {
            setError("Selected service not found.");
          } else {
            setService(found);
          }
        }
      } catch (err) {
        console.error(err);
        setError("Something went wrong while loading service.");
      } finally {
        setLoadingService(false);
      }
    }

    loadService();
  }, [serviceId]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!user) {
      setError("Please login before booking.");
      return;
    }
    if (!service) {
      setError("Service not loaded.");
      return;
    }
    if (!date || !time || !location) {
      setError("Please fill date, time and location.");
      return;
    }

    try {
      setSubmitting(true);

      const isoDateTime = new Date(`${date}T${time}:00.000Z`).toISOString();

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          serviceId: service.id,
          date: isoDateTime,
          location,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create booking");
      } else {
        setSuccessMsg("Booking created! Redirecting to payment...");
        const bookingId = data.booking.id;
        setTimeout(() => {
          router.push(`/payment?bookingId=${bookingId}`);
        }, 1200);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong while creating booking.");
    } finally {
      setSubmitting(false);
    }
  }

  const priceDisplay = service ? formatPrice(service.price) : null;

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-bold text-neutral-900">
          Book your session
        </h1>

        {loadingService && (
          <p className="mt-4 text-sm text-neutral-500">Loading service...</p>
        )}

        {!loadingService && error && (
          <p className="mt-4 text-sm text-red-600">{error}</p>
        )}

        {!loadingService && !error && service && (
          <>
            <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-5 shadow-lg">
              <h2 className="text-lg font-semibold text-neutral-900">
                {service.name}
              </h2>
              <p className="mt-1 text-sm text-neutral-600">
                {service.description}
              </p>
              <p className="mt-3 text-xl font-bold text-red-600">
                £{priceDisplay}{" "}
                <span className="text-xs text-neutral-500">
                  {service.currency}
                </span>
              </p>
            </div>

            {!user && (
              <p className="mt-4 text-sm text-red-600">
                You are not logged in. Please{" "}
                <button
                  type="button"
                  className="underline text-white"
                  onClick={() => router.push("/auth/login")}
                >
                  login
                </button>{" "}
                before booking.
              </p>
            )}

            {user && (
              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-neutral-700">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700">
                    Time
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="London, UK"
                    className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
                    required
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-600">{error}</p>
                )}

                {successMsg && (
                  <p className="text-sm text-green-600">{successMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-2 w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                >
                  {submitting ? "Creating booking..." : "Confirm Booking"}
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </section>
  );
}
