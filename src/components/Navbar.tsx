// src/components/Navbar.tsx  (or src/components/ui/Navbar.tsx)

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

type NavItem = {
  href: string;
  label: string;
  variant?: "cta";
};

const links: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const baseMobileMenuItems: NavItem[] = [
  { href: "/auth/login", label: "Login / Signup", variant: "cta" },
  ...links,
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [pressedMobileLink, setPressedMobileLink] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const prevPathnameRef = useRef(pathname);

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window === "undefined") return;
      const stored = window.localStorage.getItem("bh_user");
      setIsLoggedIn(Boolean(stored));
    };

    checkAuth();
    if (typeof window !== "undefined") {
      window.addEventListener("storage", checkAuth);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("storage", checkAuth);
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("bh_user");
    setIsLoggedIn(Boolean(stored));
  }, [pathname]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    setPressedMobileLink(null);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (prevPathnameRef.current === pathname) return;
    prevPathnameRef.current = pathname;
    setIsMobileMenuOpen(false);
    setPressedMobileLink(null);
  }, [pathname]);

  const handleMobileLinkClick = (href: string) => {
    setPressedMobileLink(href);
    if (href === pathname) {
      setTimeout(() => {
        setIsMobileMenuOpen(false);
        setPressedMobileLink(null);
      }, 180);
    }
  };

  const mobileMenuItems: NavItem[] = (() => {
    if (!isLoggedIn) return baseMobileMenuItems;
    if (pathname === "/dashboard") {
      return [{ href: "/contact", label: "Speak to us", variant: "cta" }];
    }
    return [{ href: "/dashboard", label: "Dashboard", variant: "cta" }, ...links];
  })();

  return (
    <header className="sticky top-0 z-40 bg-primary shadow relative">
      {/* full-width nav bar with some vertical padding */}
      <div className="flex w-full items-center justify-between gap-3 px-4 md:px-10 py-4">
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
          {isLoggedIn ? (
            pathname === "/dashboard" ? (
              <Link
                href="/contact"
                className="ml-4 rounded-full bg-white px-4 py-1 text-xs font-semibold uppercase tracking-wide text-primary shadow hover:bg-primary hover:text-white"
              >
                Speak to us
              </Link>
            ) : (
              <Link
                href="/dashboard"
                className="ml-4 rounded-full bg-white px-5 py-1.5 text-sm font-semibold text-primary shadow hover:bg-primary hover:text-white"
              >
                Dashboard
              </Link>
            )
          ) : (
            <Link
              href="/auth/login"
              className="ml-4 rounded-full bg-white px-5 py-1.5 text-sm font-semibold text-primary shadow hover:bg-primary hover:text-white"
            >
              Login / Signup
            </Link>
          )}
        </nav>

        {/* MOBILE CTA */}
        <Link
          href={
            isLoggedIn
              ? pathname === "/dashboard"
                ? "/contact"
                : "/dashboard"
              : "/auth/login"
          }
          className={clsx(
            "inline-flex items-center justify-center rounded-full border border-white/50 font-semibold text-white transition hover:bg-white/10 md:hidden",
            isLoggedIn && pathname === "/dashboard"
              ? "px-4 py-1.5 text-sm uppercase tracking-wide"
              : "px-5 py-2 text-base"
          )}
        >
          {isLoggedIn ? (pathname === "/dashboard" ? "Speak to us" : "Dashboard") : "Login"}
        </Link>

        {/* MOBILE PROFILE / MENU BUTTON */}
        <button
          type="button"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/70 text-white transition hover:bg-white/10 md:hidden"
        >
          <svg
            aria-hidden="true"
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          >
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
            <path d="M5.5 19a6.5 6.5 0 0 1 13 0" />
          </svg>
        </button>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {isMobileMenuOpen && (
        <div className="absolute inset-x-4 top-full mt-4 rounded-2xl border border-primary/25 bg-white text-primary shadow-2xl md:hidden">
          <nav className="flex flex-col gap-4 px-5 py-6 text-base font-semibold">
            {mobileMenuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => handleMobileLinkClick(item.href)}
                className={clsx(
                  "w-full rounded-xl border border-primary/15 px-4 py-3 text-left transition-colors",
                  item.variant === "cta"
                    ? "bg-primary text-white hover:bg-primary-dark"
                    : pressedMobileLink === item.href
                      ? "bg-primary text-white"
                      : pathname === item.href
                      ? "bg-primary/10 text-primary-dark hover:bg-primary/20"
                      : "text-primary hover:bg-primary/10"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
