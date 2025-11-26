// src/app/services/page.tsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Service = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;      // minor units (e.g. 5000 = £50)
  currency: string;
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadServices() {
      try {
        const res = await fetch("/api/services");
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Failed to load services");
        } else {
          setServices(data);
        }
      } catch (err) {
        console.error(err);
        setError("Something went wrong while loading services.");
      } finally {
        setLoading(false);
      }
    }

    loadServices();
  }, []);

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <h1 className="text-3xl font-bold text-neutral-900">Our Services</h1>
        <p className="mt-2 text-neutral-600">
          High-quality photography and reel packages with simple, fixed pricing.
        </p>

        {loading && (
          <p className="mt-8 text-sm text-neutral-500">Loading services...</p>
        )}

        {error && (
          <p className="mt-8 text-sm text-red-600">
            {error}
          </p>
        )}

        {!loading && !error && (
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {services.map((service) => {
              const priceInPounds = (service.price / 100).toFixed(2);

              return (
                <div
                  key={service.id}
                  className="flex flex-col justify-between rounded-2xl bg-white p-6 shadow-card border border-neutral-100"
                >
                  <div>
                    <h2 className="text-lg font-semibold text-neutral-900">
                      {service.name}
                    </h2>
                    <p className="mt-2 text-sm text-neutral-600">
                      {service.description}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <div>
                      <span className="text-xl font-bold text-primary">
                        £{priceInPounds}
                      </span>
                      <span className="ml-1 text-xs text-neutral-500">
                        {service.currency}
                      </span>
                    </div>

                    {/* RED BOOK BUTTON → BOOKING PAGE */}
                    <Link
                      href={`/booking?serviceId=${service.id}`}
                      className="rounded-full bg-red-600 px-4 py-1 text-xs font-semibold text-white hover:bg-red-700"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
