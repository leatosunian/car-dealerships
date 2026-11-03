"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navItems, site, waLink } from "@/lib/site";
import { ArrowIcon, CloseIcon, Mark, MenuIcon, WaIcon } from "./icons";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}

export default function SiteHeader() {
  const pathname = usePathname() || "/";
  // El menú queda abierto solo en la ruta donde se abrió: al navegar se cierra solo.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (fn: (o: boolean) => boolean) => setOpenOn(fn(open) ? pathname : null);

  return (
    <>
      {/* Desktop: flota sobre la hoja oscura con la que arranca cada página */}
      <header className="absolute inset-x-8 top-6 z-20 hidden h-[92px] items-center justify-between pl-9 pr-7 lg:flex">
        <Link href="/" aria-label={`${site.fullName}, inicio`} className="flex items-center gap-3.5" style={{ color: "var(--paper)" }}>
          <Mark />
          <span className="flex flex-col leading-[1.15]">
            <span className="text-[18px] font-semibold tracking-[-0.02em]">{site.name}</span>
            <span className="hidden text-[12.5px] xl:inline" style={{ color: "var(--fog)" }}>Automotores · desde {site.since}</span>
          </span>
        </Link>
        <nav aria-label="Principal" className="flex gap-1 rounded-full p-[5px]" style={{ background: "var(--ink-3)" }}>
          {navItems.map((item) => {
            const on = isActive(pathname, item.href);
            return (
              <Link key={item.href} href={item.href} className={`nl${on ? " on" : ""}`} aria-current={on ? "page" : undefined}>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <Link href="/contacto" className="btn dline" style={{ height: 50, padding: "0 20px", fontSize: 14.5 }}>
          <span className="dot" />Asesores en línea
        </Link>
      </header>

      {/* Mobile: cápsula fija arriba con menú desplegable */}
      <header className="sticky top-0 z-30 px-2.5 pt-2.5 lg:hidden">
        <div className="flex h-[60px] items-center justify-between rounded-full pl-2.5 pr-2" style={{ background: "var(--ink)", color: "var(--paper)", boxShadow: "0 10px 30px rgba(0,0,0,0.14)" }}>
          <Link href="/" aria-label={`${site.fullName}, inicio`} className="flex items-center gap-2.5">
            <Mark size={40} radius={14} font={15} />
            <span className="text-[16.5px] font-semibold tracking-[-0.02em]">{site.name}</span>
          </Link>
          <span className="flex items-center gap-1.5">
            <a href={waLink()} target="_blank" rel="noopener noreferrer" className="flex h-11 items-center gap-2 rounded-full px-3.5 text-[13.5px]" style={{ background: "var(--ink-4)" }}>
              <span className="dot" />En línea
            </a>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={open}
              aria-controls="menu-mobile"
              className="flex h-11 w-11 items-center justify-center rounded-full"
              style={{ background: "var(--paper)", color: "var(--ink)" }}
            >
              {open ? <CloseIcon /> : <MenuIcon />}
            </button>
          </span>
        </div>
        {open && (
          <nav id="menu-mobile" aria-label="Principal" className="mt-2 flex flex-col gap-0.5 rounded-[30px] p-2.5" style={{ background: "var(--ink)", boxShadow: "0 24px 60px rgba(0,0,0,0.25)" }}>
            {[{ href: "/", label: "Inicio" }, ...navItems].map((item) => {
              const on = item.href === "/" ? pathname === "/" : isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={on ? "page" : undefined}
                  className="flex h-14 items-center justify-between rounded-[20px] pl-[18px] pr-2 text-[18px] tracking-[-0.02em]"
                  style={on ? { background: "var(--ink-4)", color: "var(--paper)" } : { color: "var(--silver)" }}
                >
                  {item.label}
                  <span className="flex h-10 w-10 items-center justify-center" style={{ color: "var(--ash)" }}><ArrowIcon /></span>
                </Link>
              );
            })}
            <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn light mt-2" style={{ height: 56 }}>
              <WaIcon />Escribinos por WhatsApp
            </a>
          </nav>
        )}
      </header>
    </>
  );
}
