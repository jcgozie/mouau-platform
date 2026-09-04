"use client";

import { useState } from "react";
import Image from "next/image";

const NAV_ITEMS = [
  { label: "About", href: "/about" },
  { label: "Study", href: "/study" },
  { label: "Research & Innovation", href: "/research" },
  { label: "Colleges & Departments", href: "/colleges" },
  { label: "Centres & Excellence", href: "/centres" },
  { label: "Directorates & Services", href: "/directorates" },
  { label: "Students", href: "/students" },
  { label: "Sponsors & Parents", href: "/sponsors" },
  { label: "Alumni & Giving", href: "/alumni" },
  { label: "Partners & Industry", href: "/partners" },
  { label: "News & Media", href: "/news" },
  { label: "Contact & Support", href: "/contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-sage bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <a href="/" className="flex items-center gap-3">
          <Image
            src="/images/mouau-logo.jpg"
            alt="MOUAU crest"
            width={40}
            height={34}
            className="h-9 w-auto"
            priority
          />
          <span className="flex items-baseline gap-2">
            <span className="font-display text-2xl font-semibold tracking-tight text-forest">
              MOUAU
            </span>
            <span className="hidden font-body text-xs text-ink/60 md:inline">
              Michael Okpara University of Agriculture
            </span>
          </span>
        </a>

        <nav className="hidden lg:block">
          <ul className="flex items-center gap-6 text-sm">
            {NAV_ITEMS.slice(0, 6).map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-ink/75 transition-colors duration-400 hover:text-forest"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <details className="group relative">
                <summary className="cursor-pointer list-none text-ink/75 transition-colors duration-400 hover:text-forest">
                  More
                </summary>
                <ul className="absolute right-0 top-full mt-2 w-64 rounded-sm border border-sage bg-paper py-2 shadow-lg">
                  {NAV_ITEMS.slice(6).map((item) => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        className="block px-4 py-2 text-sm text-ink/75 hover:bg-sage-dim hover:text-forest"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </details>
            </li>
          </ul>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href="/portals"
            className="rounded-sm border border-forest px-4 py-2 text-sm font-medium text-forest transition-colors duration-400 hover:bg-forest hover:text-paper"
          >
            Portals
          </a>
          <a
            href="/study/admissions"
            className="rounded-sm bg-gold px-4 py-2 text-sm font-medium text-ink transition-colors duration-400 hover:bg-gold-dark hover:text-paper"
          >
            Apply Now
          </a>
        </div>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label="Toggle navigation menu"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-sm border border-sage lg:hidden"
        >
          <span aria-hidden className="relative block h-3 w-5">
            <span
              className={`absolute left-0 top-0 h-0.5 w-5 bg-ink transition-transform duration-400 ${
                open ? "translate-y-[5px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 bottom-0 h-0.5 w-5 bg-ink transition-transform duration-400 ${
                open ? "-translate-y-[5px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" className="border-t border-sage bg-paper lg:hidden">
          <ul className="mx-auto max-w-7xl px-5 py-3">
            {NAV_ITEMS.map((item) => (
              <li key={item.href} className="border-b border-sage-dim last:border-0">
                <a href={item.href} className="block py-3 text-ink/80">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mx-auto flex max-w-7xl gap-3 px-5 pb-5">
            <a
              href="/portals"
              className="flex-1 rounded-sm border border-forest px-4 py-2 text-center text-sm font-medium text-forest"
            >
              Portals
            </a>
            <a
              href="/study/admissions"
              className="flex-1 rounded-sm bg-gold px-4 py-2 text-center text-sm font-medium text-ink"
            >
              Apply Now
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
