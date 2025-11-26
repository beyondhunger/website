// src/app/page.tsx

import Link from "next/link";
import Hero from "@/components/Hero";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Hero />

      <section className="bg-primary-soft">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-2xl font-bold text-neutral-900 md:text-3xl">
            Choose your service
          </h2>
          <p className="mt-2 text-neutral-600">
            Simple, transparent packages for your next shoot.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              {
                name: "Photography",
                price: "£50",
                desc: "Portrait / event sessions",
              },
              {
                name: "Reel",
                price: "£40",
                desc: "Short vertical video reels",
              },
              {
                name: "Photography & Reel",
                price: "£70",
                desc: "Best of both",
              },
            ].map((s) => (
              <div
                key={s.name}
                className="flex flex-col justify-between rounded-2xl bg-white p-6 shadow-card border border-neutral-100"
              >
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900">
                    {s.name}
                  </h3>
                  <p className="mt-2 text-sm text-neutral-600">{s.desc}</p>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <span className="text-xl font-bold text-primary">
                    {s.price}
                  </span>

                  {/* RED BOOK BUTTON */}
                  <Link
                    href="/services"
                    className="rounded-full bg-red-600 px-4 py-1 text-xs font-semibold text-white hover:bg-red-700"
                  >
                    Book
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
