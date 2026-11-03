"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { cuotaFrancesa, pesos, site, tnaLabel } from "@/lib/site";
import { ArrowIcon, BackIcon } from "./icons";

export function Gallery({ photos, name }: { photos: string[]; name: string }) {
  const [i, setI] = useState(0);
  const n = photos.length;
  if (n === 0) {
    return <div className="h-[280px] rounded-[26px] lg:h-[600px] lg:rounded-[30px]" style={{ background: "var(--ink-3)" }} />;
  }
  return (
    <div className="flex flex-col gap-2.5">
      <div className="relative h-[280px] overflow-hidden rounded-[26px] sm:h-[420px] lg:h-[600px] lg:rounded-[30px]" style={{ background: "var(--ink-3)" }}>
        <Image key={photos[i]} src={photos[i]} alt={`${name}, foto ${i + 1} de ${n}`} fill priority={i === 0} sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
        <span className="glass mono absolute left-4 top-4 flex h-9 items-center rounded-full px-3.5 text-[12.5px]">{i + 1} / {n}</span>
        {n > 1 && (
          <span className="absolute bottom-4 right-4 flex gap-2">
            <button type="button" onClick={() => setI((i - 1 + n) % n)} aria-label="Foto anterior" className="glass flex h-[52px] w-[52px] items-center justify-center rounded-full"><BackIcon /></button>
            <button type="button" onClick={() => setI((i + 1) % n)} aria-label="Foto siguiente" className="flex h-[52px] w-[52px] items-center justify-center rounded-full" style={{ background: "var(--paper)", color: "var(--ink)" }}><ArrowIcon size={18} /></button>
          </span>
        )}
      </div>
      {n > 1 && (
        <div className="no-scrollbar flex gap-2.5 overflow-x-auto">
          {photos.map((src, j) => (
            <button
              key={src}
              type="button"
              aria-pressed={i === j}
              aria-label={`Ver foto ${j + 1}`}
              onClick={() => setI(j)}
              className="thumb relative h-[76px] w-[108px] flex-none overflow-hidden rounded-[18px] lg:h-[110px] lg:w-[calc(25%-7.5px)] lg:rounded-[20px]"
              style={{ background: "var(--ink-3)", border: `2px solid ${i === j ? "var(--paper)" : "transparent"}`, opacity: i === j ? 1 : 0.55 }}
            >
              <Image src={src} alt="" fill sizes="200px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

type Tab = { label: string; intro: string; items?: { t: string; s: string }[]; text?: string };

export function DetailTabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(0);
  const tab = tabs[active];
  return (
    <div className="panel flex min-w-0 flex-1 flex-col gap-6 p-5 lg:gap-7 lg:p-10">
      <div role="tablist" aria-label="Detalle del vehículo" className="seg no-scrollbar self-stretch overflow-x-auto lg:self-start" style={{ background: "var(--mist)", padding: 5 }}>
        {tabs.map((t, i) => (
          <button
            key={t.label}
            type="button"
            role="tab"
            aria-selected={active === i}
            onClick={() => setActive(i)}
            style={{ height: 46, padding: "0 20px", fontSize: 14.5, ...(active === i ? { background: "var(--ink)", color: "var(--paper)" } : { color: "var(--ink-5)" }) }}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="flex flex-col gap-6">
        <p className="mut max-w-[640px] text-[15px] leading-relaxed lg:text-[16px]">{tab.intro}</p>
        {tab.text && <p className="whitespace-pre-line text-[15px] leading-relaxed">{tab.text}</p>}
        {tab.items && (
          <ul className="grid gap-x-8 sm:grid-cols-2">
            {tab.items.map((item) => (
              <li key={item.t} className="flex items-center justify-between gap-4 border-t py-4 text-[15px] lg:text-[15.5px]" style={{ borderColor: "var(--stone)" }}>
                <span>{item.t}</span>
                <span className="mut flex items-center gap-2 text-right text-[13.5px]"><span className="dot" style={{ width: 7, height: 7 }} />{item.s}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

const PLAZOS = [12, 24, 36, 48, 60];

export function FinanceBox({ priceArs }: { priceArs: number | null }) {
  const max = priceArs ? Math.max(2_000_000, Math.round((priceArs * 0.7) / 1_000_000) * 1_000_000) : 40_000_000;
  const [monto, setMonto] = useState(Math.min(max, priceArs ? Math.round((priceArs * 0.5) / 1_000_000) * 1_000_000 || 1_000_000 : 20_000_000));
  const [plazo, setPlazo] = useState(36);
  const cuota = cuotaFrancesa(monto, site.tnaFija, plazo);

  return (
    <div className="flex flex-col gap-[22px] rounded-[28px] p-6 lg:w-[460px] lg:flex-none lg:rounded-[32px] lg:p-8" style={{ background: "var(--ink)", color: "var(--paper)" }}>
      <h2 className="text-[26px] font-medium leading-[1.1] tracking-[-0.04em] lg:text-[28px]">
        Financiá una parte<br /><span style={{ color: "var(--ash)" }}>en pesos, a tasa fija.</span>
      </h2>
      <div className="flex flex-col gap-2.5">
        <label htmlFor="fi-monto" className="flex justify-between text-[14px]" style={{ color: "var(--silver)" }}>
          <span>Monto a financiar</span><span className="mono" style={{ color: "var(--paper)" }}>{pesos(monto)}</span>
        </label>
        <input id="fi-monto" type="range" min={1_000_000} max={max} step={500_000} value={monto} onChange={(e) => setMonto(Number(e.target.value))} style={{ accentColor: "var(--paper)" }} />
      </div>
      <div className="flex flex-col gap-2.5">
        <span id="fi-plazo" className="text-[14px]" style={{ color: "var(--silver)" }}>Plazo en meses</span>
        <div role="radiogroup" aria-labelledby="fi-plazo" className="grid grid-cols-5 gap-1.5">
          {PLAZOS.map((p) => (
            <button key={p} type="button" role="radio" aria-checked={plazo === p} onClick={() => setPlazo(p)} className={`dchip mono${plazo === p ? " on" : ""}`} style={{ padding: 0, fontSize: 13 }}>{p}</button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-1 rounded-[22px] p-[22px]" style={{ background: "var(--paper)", color: "var(--ink)" }}>
        <span className="mut text-[13.5px]">Cuota mensual estimada</span>
        <span className="text-[38px] font-semibold leading-none tracking-[-0.05em] lg:text-[44px]">{pesos(cuota)}</span>
      </div>
      <p className="mono text-[11.5px] leading-relaxed" style={{ color: "var(--ash)" }}>TNA {tnaLabel(site.tnaFija)} · Sistema francés · Referencia. El CFTEA con IVA se informa en la propuesta.</p>
      <Link href="/financiacion" className="btn light">Ver opciones de financiación</Link>
    </div>
  );
}
