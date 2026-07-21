"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "@/components/atoms/Logo";
import { Button } from "@/components/atoms/Button";
import { NAV_LINKS, type NavItem } from "@/lib/constants";
import { cn } from "@/lib/utils";

function isNavActive(pathname: string, link: NavItem) {
  if (link.children?.length) {
    return link.children.some((child) =>
      child.href === "/"
        ? pathname === "/"
        : pathname === child.href || pathname.startsWith(`${child.href}/`),
    );
  }
  return link.href === "/"
    ? pathname === "/"
    : pathname === link.href || pathname.startsWith(`${link.href}/`);
}

function DesktopDropdown({ link }: { link: NavItem }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const active = isNavActive(pathname, link);
  const children = link.children ?? [];

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium transition",
          active
            ? "bg-forest-800 text-white"
            : "text-ink-700 hover:bg-forest-50 hover:text-forest-800",
        )}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
      >
        {link.label}
        <ChevronDown
          className={cn("size-3.5 transition", open && "rotate-180")}
          aria-hidden
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={menuId}
            role="menu"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
            className="absolute left-0 top-full z-50 min-w-[12.5rem] pt-2"
          >
            <div className="overflow-hidden rounded-2xl border border-earth-400/15 bg-ivory-50/95 py-2 shadow-premium backdrop-blur-xl">
              {children.map((child) => {
                const childActive =
                  pathname === child.href ||
                  pathname.startsWith(`${child.href}/`);
                return (
                  <Link
                    key={child.href}
                    href={child.href}
                    role="menuitem"
                    className={cn(
                      "block px-4 py-2.5 text-sm font-medium transition",
                      childActive
                        ? "bg-forest-800 text-white"
                        : "text-ink-700 hover:bg-forest-50 hover:text-forest-800",
                    )}
                    onClick={() => setOpen(false)}
                  >
                    {child.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mobileCorporateOpen, setMobileCorporateOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setMobileCorporateOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-earth-400/10 bg-ivory-50/80 py-2 backdrop-blur-xl shadow-sm"
          : "bg-transparent py-4",
      )}
    >
      <div className="container-wide flex items-center justify-between gap-4">
        <Logo compact={scrolled} />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Ana menü">
          {NAV_LINKS.map((link) => {
            if (link.children?.length) {
              return <DesktopDropdown key={link.label} link={link} />;
            }

            const active = isNavActive(pathname, link);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm font-medium transition",
                  active
                    ? "bg-forest-800 text-white"
                    : "text-ink-700 hover:bg-forest-50 hover:text-forest-800",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            asChild
            size={scrolled ? "sm" : "md"}
            className="hidden sm:inline-flex"
          >
            <Link href="/teklif-al">Teklif Al</Link>
          </Button>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full border border-earth-400/20 bg-white/70 text-forest-800 backdrop-blur lg:hidden"
            aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-x-0 top-full border-b border-earth-400/10 bg-ivory-50/95 backdrop-blur-xl lg:hidden"
          >
            <nav
              className="container-wide flex flex-col gap-1 py-4"
              aria-label="Mobil menü"
            >
              {NAV_LINKS.map((link) => {
                if (link.children?.length) {
                  const active = isNavActive(pathname, link);
                  return (
                    <div key={link.label} className="rounded-2xl">
                      <button
                        type="button"
                        className={cn(
                          "flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-base font-medium",
                          active
                            ? "bg-forest-800 text-white"
                            : "text-ink-800 hover:bg-forest-50",
                        )}
                        aria-expanded={mobileCorporateOpen}
                        onClick={() =>
                          setMobileCorporateOpen((value) => !value)
                        }
                      >
                        {link.label}
                        <ChevronDown
                          className={cn(
                            "size-4 transition",
                            mobileCorporateOpen && "rotate-180",
                          )}
                          aria-hidden
                        />
                      </button>
                      <AnimatePresence initial={false}>
                        {mobileCorporateOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="flex flex-col gap-1 pb-2 pl-3 pt-1">
                              {link.children.map((child) => (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  className="rounded-xl px-4 py-2.5 text-sm font-medium text-ink-700 hover:bg-forest-50 hover:text-forest-800"
                                >
                                  {child.label}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-2xl px-4 py-3 text-base font-medium text-ink-800 hover:bg-forest-50"
                  >
                    {link.label}
                  </Link>
                );
              })}
              <Button asChild className="mt-2 w-full">
                <Link href="/teklif-al">Teklif Al</Link>
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
