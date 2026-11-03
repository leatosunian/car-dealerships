"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { PublicCar } from "@/lib/car-format";
import { cuotaFrancesa, pesos, site, tnaLabel } from "@/lib/site";
import { ArrowIcon, BackIcon, SearchIcon } from "./icons";
import { CarTile } from "./CarCards";
import Select from "./Select";

const CONDS = [
  { id: "", label: "Todos" },
  { id: "0km", label: "0 km" },
  { id: "usados", label: "Usados" },
];

export function HomeSearch() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [cond, setCond] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("search", q.trim());
    if (cond) params.set("cond", cond);
    const qs = params.toString();
    router.push(`/vehicles${qs ? `?${qs}` : ""}`);
  }

  return (
    <form
      role="search"
      onSubmit={submit}
      className="flex flex-col gap-2 rounded-[30px] bg-white p-2 lg:h-[78px] lg:flex-row lg:items-center lg:gap-3 lg:rounded-full lg:py-2 lg:pl-[30px] lg:pr-2"
      style={{ boxShadow: "0 18px 50px rgba(0,0,0,0.12)" }}
    >
      <label className="flex h-14 flex-1 items-center gap-3 px-4 lg:h-auto lg:px-0">
        <SearchIcon className="flex-none" />
        <span className="sr-only">Buscar en el stock</span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Marca o modelo"
          className="h-[60px] w-full flex-1 bg-transparent px-1.5 text-[16px] outline-none"
        />
      </label>
      <span role="radiogroup" aria-label="Condición" className="seg" style={{ background: "var(--mist)" }}>
        {CONDS.map((c) => {
          const on = cond === c.id;
          return (
            <button
              key={c.id}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => setCond(c.id)}
              className="flex-1"
              style={on ? { background: "var(--ink)", color: "var(--paper)" } : { color: "var(--ink-5)" }}
            >
              {c.label}
            </button>
          );
        })}
      </span>
      <button type="submit" className="btn" style={{ height: 62, padding: "0 30px" }}>Buscar</button>
    </form>
  );
}

export function HomeArrivals({ cars }: { cars: PublicCar[] }) {
  const [page, setPage] = useState(0);
  const pages = Math.max(1, Math.ceil(cars.length / 3));
  const visible = cars.slice(page * 3, page * 3 + 3);

  if (cars.length === 0) {
    return (
      <div className="panel p-10 text-center">
        <p className="mut">Estamos cargando las unidades nuevas. Mientras tanto, escribinos y te contamos qué hay.</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-7 flex items-end justify-between gap-6 lg:mb-9">
        <div className="flex flex-col gap-3.5">
          <h2 className="text-[38px] font-semibold leading-none tracking-[-0.05em] lg:text-[60px]">Recién llegados</h2>
          <p className="mut text-[15px] lg:text-[16.5px]">Las últimas unidades que entraron. Se reservan rápido.</p>
        </div>
        <span className="hidden items-center gap-2 lg:flex">
          <span className="mono mut mr-3 text-[13px]">{page + 1} / {pages}</span>
          <button type="button" onClick={() => setPage((page - 1 + pages) % pages)} aria-label="Anteriores" className="pill-link flex h-14 w-14 items-center justify-center rounded-full border" style={{ borderColor: "var(--silver)" }}>
            <BackIcon />
          </button>
          <button type="button" onClick={() => setPage((page + 1) % pages)} aria-label="Siguientes" className="flex transition hover:opacity-85 h-14 w-14 items-center justify-center rounded-full" style={{ background: "var(--ink)", color: "var(--paper)" }}>
            <ArrowIcon size={18} />
          </button>
        </span>
      </div>
      {/* Desktop: páginas de a tres */}
      <div className="hidden grid-cols-3 gap-5 lg:grid">
        {visible.map((car) => <CarTile key={car.uuid} car={car} className="h-[500px]" />)}
      </div>
      {/* Mobile: scroll horizontal */}
      <div className="no-scrollbar -mx-2.5 flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-2.5 lg:hidden">
        {cars.map((car) => (
          <div key={car.uuid} className="w-[82%] flex-none snap-start">
            <CarTile car={car} className="h-[470px]" />
          </div>
        ))}
      </div>
    </>
  );
}

const QUOTE_BRANDS = ["Toyota", "Volkswagen", "Ford", "Chevrolet", "Peugeot", "Renault", "Fiat", "Otra"];
const thisYear = new Date().getFullYear();
const QUOTE_YEARS = Array.from({ length: 15 }, (_, i) => String(thisYear - i));

export function HomeQuote() {
  const router = useRouter();
  const [brand, setBrand] = useState("Toyota");
  const [year, setYear] = useState(QUOTE_YEARS[4]);
  const [km, setKm] = useState("");

  function go(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams({ brand, year });
    if (km) params.set("km", km);
    router.push(`/cotizar?${params.toString()}`);
  }

  return (
    <form onSubmit={go} className="flex flex-col gap-7">
      <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-3">
        <label className="field">
          <span>Marca</span>
          <Select value={brand} onChange={setBrand} options={QUOTE_BRANDS} />
        </label>
        <label className="field">
          <span>Año</span>
          <Select value={year} onChange={setYear} options={QUOTE_YEARS} />
        </label>
        <label className="field col-span-2 lg:col-span-1">
          <span>Kilómetros</span>
          <input className="input" inputMode="numeric" placeholder="45.000" value={km} onChange={(e) => setKm(e.target.value.replace(/[^\d.]/g, ""))} />
        </label>
      </div>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-2.5">
        <button type="submit" className="btn go">Cotizar mi usado<span className="arrow"><ArrowIcon /></span></button>
        <span className="mut text-[14px]">Sin compromiso · Respuesta por WhatsApp</span>
      </div>
    </form>
  );
}

const MONTOS = [10_000_000, 20_000_000, 30_000_000, 45_000_000];
const PLAZOS = [12, 24, 36, 48, 60];

export function FinanceTeaser() {
  const [monto, setMonto] = useState(20_000_000);
  const [plazo, setPlazo] = useState(36);
  const cuota = cuotaFrancesa(monto, site.tnaFija, plazo);

  return (
    <div className="flex flex-col gap-[22px] rounded-[26px] p-6 lg:w-[560px] lg:flex-none lg:p-8" style={{ background: "var(--paper)", color: "var(--ink)" }}>
      <div className="flex flex-col gap-2.5">
        <span id="h-monto" className="text-[14px]">Monto a financiar</span>
        <div role="radiogroup" aria-labelledby="h-monto" className="grid grid-cols-2 gap-2 sm:flex">
          {MONTOS.map((m) => (
            <button key={m} type="button" role="radio" aria-checked={monto === m} onClick={() => setMonto(m)} className={`chip mono${monto === m ? " on" : ""}`} style={{ fontSize: 13 }}>
              $ {m / 1_000_000} M
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2.5">
        <span id="h-plazo" className="text-[14px]">Plazo en meses</span>
        <div role="radiogroup" aria-labelledby="h-plazo" className="grid grid-cols-5 gap-1.5 lg:gap-2">
          {PLAZOS.map((p) => (
            <button key={p} type="button" role="radio" aria-checked={plazo === p} onClick={() => setPlazo(p)} className={`chip mono${plazo === p ? " on" : ""}`} style={{ fontSize: 13, padding: 0 }}>
              {p}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-4 rounded-[22px] bg-white p-6 lg:flex-row lg:items-end lg:justify-between">
        <span className="flex flex-col gap-1.5">
          <span className="mut text-[14px]">Cuota mensual estimada</span>
          <span className="text-[40px] font-semibold leading-none tracking-[-0.05em] lg:text-[50px]">{pesos(cuota)}</span>
        </span>
        <Link href="/financiacion" className="btn">Simular en detalle</Link>
      </div>
      <p className="mono mut text-[12px] leading-relaxed">TNA {tnaLabel(site.tnaFija)} · Sistema francés · Valor de referencia. El CFTEA con IVA se informa en cada propuesta.</p>
    </div>
  );
}
