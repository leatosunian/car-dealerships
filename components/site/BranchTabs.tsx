"use client";
import Link from "next/link";
import { useState } from "react";
import { branches, site } from "@/lib/site";

function IllustrativeMap({ name }: { name: string }) {
  return (
    <div role="img" aria-label={`Mapa ilustrativo de la sucursal ${name}`} className="relative min-h-[220px] flex-1 overflow-hidden rounded-[22px] lg:min-h-[460px] lg:rounded-3xl" style={{ background: "var(--line)" }}>
      <svg width="100%" height="100%" viewBox="0 0 520 460" preserveAspectRatio="xMidYMid slice" aria-hidden="true" className="absolute inset-0">
        <path d="M-20 120 L540 60" stroke="#F7F7F5" strokeWidth="26" />
        <path d="M-20 330 L540 300" stroke="#F7F7F5" strokeWidth="18" />
        <path d="M140 -20 L210 480" stroke="#F7F7F5" strokeWidth="18" />
        <path d="M380 -20 L340 480" stroke="#F7F7F5" strokeWidth="12" />
        <path d="M-20 220 L540 210" stroke="#F7F7F5" strokeWidth="8" />
        <path d="M60 -20 L100 480" stroke="#F7F7F5" strokeWidth="6" />
        <path d="M460 -20 L480 480" stroke="#F7F7F5" strokeWidth="6" />
        <rect x="230" y="236" width="90" height="50" rx="12" fill="#C9C9C4" />
        <rect x="400" y="120" width="60" height="70" rx="12" fill="#C9C9C4" />
      </svg>
      <span className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-full flex-col items-center">
        <span className="flex h-11 items-center gap-2.5 whitespace-nowrap rounded-full px-4 text-[14px] font-medium" style={{ background: "var(--ink)", color: "var(--paper)", boxShadow: "0 10px 24px rgba(0,0,0,0.2)" }}>
          <span className="flex h-6 w-6 items-center justify-center rounded-lg text-[10px] font-bold" style={{ background: "var(--paper)", color: "var(--ink)" }}>{site.monogram}</span>
          {site.name} {name}
        </span>
        <span className="h-4 w-0.5" style={{ background: "var(--ink)" }} />
        <span className="h-3 w-3 rounded-full border-[3px]" style={{ background: "var(--ink)", borderColor: "var(--paper)" }} />
      </span>
    </div>
  );
}

export default function BranchTabs() {
  const [i, setI] = useState(0);
  const cur = branches[i];

  return (
    <div className="flex flex-col gap-2.5 lg:flex-row lg:items-stretch lg:gap-5">
      <div role="tablist" aria-label="Sucursales" className="flex gap-1 rounded-full bg-[var(--stone)] p-1 lg:w-[400px] lg:flex-none lg:flex-col lg:gap-2.5 lg:rounded-none lg:bg-transparent lg:p-0">
        {branches.map((b, j) => {
          const on = i === j;
          return (
            <button
              key={b.name}
              type="button"
              role="tab"
              aria-selected={on}
              aria-controls="sucursal-panel"
              onClick={() => setI(j)}
              className={`h-[46px] flex-1 rounded-full text-[14px] lg:flex lg:h-auto lg:min-h-[120px] lg:flex-col lg:justify-between lg:gap-3 lg:rounded-[28px] lg:px-[26px] lg:py-6 lg:text-left${on ? "" : " lg:bg-[var(--panel)]"}`}
              style={on ? { background: "var(--ink)", color: "var(--paper)" } : { color: "var(--ink-5)" }}
            >
              <span className="lg:text-[26px] lg:font-semibold lg:tracking-[-0.04em]">{b.name}</span>
              <span className="hidden text-[14.5px] lg:block" style={{ color: on ? "var(--fog)" : "var(--muted)" }}>{b.kind}</span>
            </button>
          );
        })}
      </div>
      <div id="sucursal-panel" role="tabpanel" className="panel flex flex-col gap-2 p-2 lg:flex-1 lg:flex-row lg:gap-3 lg:p-3">
        <IllustrativeMap name={cur.name} />
        <div className="flex flex-col gap-5 rounded-[22px] bg-white p-5 lg:w-[360px] lg:flex-none lg:gap-[22px] lg:rounded-3xl lg:p-7">
          <div className="flex flex-col gap-1.5">
            <span className="mut text-[13.5px]">Dirección</span>
            <span className="text-[16px] leading-snug lg:text-[17px]">{cur.addr}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="mut text-[13.5px]">Horarios</span>
            {cur.hours.map((h) => (
              <span key={h.d} className="flex justify-between text-[15px]"><span>{h.d}</span><span className="mono text-[13.5px]">{h.h}</span></span>
            ))}
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="mut text-[13.5px]">Teléfono</span>
            <span className="mono text-[15px]">{cur.tel}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {cur.services.map((s) => (
              <span key={s} className="inline-flex h-[34px] items-center rounded-full px-3.5 text-[13px]" style={{ background: "var(--mist)" }}>{s}</span>
            ))}
          </div>
          <div className="mt-auto flex gap-2 lg:flex-col">
            <a href={cur.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn flex-1 lg:flex-none">Cómo llegar</a>
            <Link href="/contacto" className="btn line flex-1 lg:flex-none">Agendar una visita</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
