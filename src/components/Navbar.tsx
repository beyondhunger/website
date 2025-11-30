// src/components/Navbar.tsx  (or src/components/ui/Navbar.tsx)

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-primary shadow">
      {/* full-width nav bar with some vertical padding */}
      <div className="flex w-full items-center justify-between px-4 md:px-10 py-4">
        {/* LOGO – left corner, bigger */}
        <Link
          href="/"
          className="font-extrabold text-3xl tracking-tight text-white"
        >
          Beyond Hunger
        </Link>

        {/* DESKTOP NAV LINKS */}
        <nav className="hidden items-center gap-3 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "rounded-full px-4 py-1 text-sm font-medium transition",
                pathname === link.href
                  ? "bg-white/90 text-primary"
                  : "text-white hover:bg-primary-dark hover:text-white"
              )}
            >
              {link.label}
            </Link>
          ))}

          {/* SINGLE LOGIN / SIGNUP BUTTON */}
          <Link
            href="/auth/login"
            className="ml-4 rounded-full bg-white px-5 py-1.5 text-sm font-semibold text-primary shadow hover:bg-primary hover:text-white"
          >
            Login / Signup
          </Link>
        </nav>
      </div>
    </header>
  );
}
