"use client";

import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/redo.jpg"
          alt="Hero background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-32 md:py-56">
        <div className="max-w-2xl">
          <p className="text-white text-sm uppercase tracking-wide">
            Grow with Beyond Hunger
          </p>

          <h1 className="mt-4 text-3xl md:text-5xl font-bold text-white">
            Brand Personality &amp; Visual Identity
          </h1>

          <p className="mt-4 text-base md:text-lg text-slate-100 max-w-xl">
            Book professional photography and reels that make your brand feel
            premium and personal.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            {/* RED BUTTON */}
            <Link
              href="/services"
              className="rounded-full bg-[#ff2121] text-white px-6 py-2 text-sm font-semibold hover:bg-red-700"
            >
              Book Now
            </Link>

            {/* Secondary Button (White Border) */}
            <Link
              href="/download"
              className="rounded-full border border-white/70 text-white px-6 py-2 text-sm font-semibold hover:bg-white/10"
            >
              Download the App
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
