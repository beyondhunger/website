"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface DashboardUser {
  id: string;
  email: string;
  name?: string | null;
}

interface BookingSummary {
  id: string;
  date: string;
  location: string;
  status: string;
  service: {
    id: string;
    name: string;
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<DashboardUser | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [bookings, setBookings] = useState<{ upcoming: BookingSummary[]; previous: BookingSummary[] }>({
    upcoming: [],
    previous: []
  });
  const [isFetchingBookings, setIsFetchingBookings] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem("bh_user") : null;

    if (!stored) {
      router.replace("/auth/login");
      return;
    }

    try {
      const parsed = JSON.parse(stored) as DashboardUser;
      setUser(parsed);
    } catch (err) {
      console.error("Failed to parse user from storage", err);
      window.localStorage.removeItem("bh_user");
      router.replace("/auth/login");
    } finally {
      setIsLoadingUser(false);
    }
  }, [router]);

  useEffect(() => {
    if (!user) return;
    const userId = user.id;

    async function fetchBookings() {
      setIsFetchingBookings(true);
      setError(null);

      try {
        const res = await fetch(`/api/bookings?userId=${userId}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load bookings");
        }

        setBookings({
          upcoming: data.upcoming || [],
          previous: data.previous || []
        });
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Unable to load bookings");
      } finally {
        setIsFetchingBookings(false);
      }
    }

    fetchBookings();
  }, [user]);

  const initials = useMemo(() => {
    if (!user) return "";
    if (user.name) {
      return user.name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() || "")
        .join("");
    }
    return user.email.charAt(0).toUpperCase();
  }, [user]);

  const upcomingCount = bookings.upcoming.length;
  const previousCount = bookings.previous.length;

  if (isLoadingUser) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-neutral-600">
        Loading your dashboard...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <section className="min-h-screen bg-neutral-50 py-12">
      <div className="mx-auto max-w-5xl px-4">
        <header className="flex flex-col gap-4 rounded-3xl bg-white px-6 py-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-xl font-semibold text-primary">
              {initials}
            </div>
            <div>
              <p className="text-sm uppercase tracking-wide text-neutral-500">Client Profile</p>
              <h1 className="text-2xl font-semibold text-neutral-900">{user.name || "Client"}</h1>
              <p className="text-sm text-neutral-500">{user.email}</p>
            </div>
          </div>

          <Link
            href="/booking"
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow hover:bg-primary-dark"
          >
            Book a Shoot
          </Link>
        </header>

        <div className="mt-8 grid gap-6 rounded-3xl bg-white p-6 shadow-sm md:grid-cols-3">
          <StatCard label="Upcoming Bookings" value={upcomingCount} />
          <StatCard label="Previous Bookings" value={previousCount} />
          <StatCard label="Status" value={upcomingCount > 0 ? "Active" : "No Active Bookings"} accent={upcomingCount > 0 ? "success" : "muted"} />
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <BookingSection
            title="Upcoming Bookings"
            description="Keep track of what’s coming next."
            items={bookings.upcoming}
            emptyText="No upcoming bookings yet."
            loading={isFetchingBookings}
          />

          <BookingSection
            title="Previous Bookings"
            description="A look back at the sessions you’ve completed."
            items={bookings.previous}
            emptyText="No previous bookings yet."
            loading={isFetchingBookings}
          />
        </div>

        {error && <p className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
      </div>
    </section>
  );
}

function StatCard({ label, value, accent = "default" }: { label: string; value: number | string; accent?: "default" | "success" | "muted" }) {
  const accentClasses = {
    default: "text-primary",
    success: "text-green-600",
    muted: "text-neutral-500"
  }[accent];

  return (
    <div className="rounded-2xl bg-neutral-50 px-6 py-5">
      <p className="text-sm uppercase tracking-wide text-neutral-500">{label}</p>
      <p className={`mt-2 text-3xl font-semibold ${accentClasses}`}>{value}</p>
    </div>
  );
}

function BookingSection({
  title,
  description,
  items,
  emptyText,
  loading
}: {
  title: string;
  description: string;
  items: BookingSummary[];
  emptyText: string;
  loading: boolean;
}) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>
          <p className="text-sm text-neutral-500">{description}</p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {loading && <p className="text-sm text-neutral-500">Loading...</p>}

        {!loading && items.length === 0 && (
          <p className="rounded-2xl bg-neutral-50 px-4 py-3 text-sm text-neutral-500">{emptyText}</p>
        )}

        {items.map((booking) => (
          <article key={booking.id} className="rounded-2xl border border-neutral-100 px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500">{new Date(booking.date).toLocaleDateString()} · {booking.location}</p>
                <p className="text-base font-semibold text-neutral-900">{booking.service.name}</p>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                {booking.status.replace(/_/g, " ")}
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
