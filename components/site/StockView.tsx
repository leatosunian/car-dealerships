"use client";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { PublicCar } from "@/lib/car-format";
import { CarCard } from "./CarCards";
import { ArrowIcon, CloseIcon, SearchIcon, SortIcon } from "./icons";
import Select from "./Select";

const PER_PAGE = 12;
const CONDS = [
  { id: "", label: "Todos" },
  { id: "0km", label: "0 km" },
  { id: "usados", label: "Usados" },
];
const SORTS = [
  { id: "recent", label: "Más recientes" },
  { id: "low", label: "Menor precio" },
  { id: "high", label: "Mayor precio" },
];

function norm(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

// Ordena por precio dentro de cada moneda: primero pesos, después dólares.
function byPrice(dir: 1 | -1) {
  return (a: PublicCar, b: PublicCar) =>
    a.currency !== b.currency ? (a.currency === "ARS" ? -1 : 1) : dir * (a.price - b.price);
}

export default function StockView({ cars }: { cars: PublicCar[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [q, setQ] = useState(params.get("search") ?? "");
  const [cond, setCond] = useState(params.get("cond") ?? "");
  const [body, setBody] = useState(params.get("body") ?? "");
  const [brands, setBrands] = useState<string[]>(params.get("brand") ? [params.get("brand")!] : []);
  const [fuel, setFuel] = useState("");
  const [gearbox, setGearbox] = useState("");
  const [yearFrom, setYearFrom] = useState("");
  const [sort, setSort] = useState("recent");
  // La página vuelve a 1 cada vez que cambia algún filtro.
  const filterKey = JSON.stringify([q, cond, body, brands, fuel, gearbox, yearFrom, sort]);
  const [paging, setPaging] = useState({ key: filterKey, page: 1 });
  const page = paging.key === filterKey ? paging.page : 1;
  const setPage = (p: number) => setPaging({ key: filterKey, page: p });
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Mantiene la URL compartible con los filtros principales.
  useEffect(() => {
    const next = new URLSearchParams();
    if (q.trim()) next.set("search", q.trim());
    if (cond) next.set("cond", cond);
    if (body) next.set("body", body);
    if (brands.length === 1) next.set("brand", brands[0]);
    const qs = next.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
  }, [q, cond, body, brands, pathname, router]);


  const options = useMemo(() => {
    const count = (key: (c: PublicCar) => string) => {
      const m = new Map<string, number>();
      for (const c of cars) {
        const k = key(c);
        if (k) m.set(k, (m.get(k) ?? 0) + 1);
      }
      return Array.from(m.entries()).sort((a, b) => b[1] - a[1]);
    };
    const years = Array.from(new Set(cars.map((c) => c.year))).sort((a, b) => b - a);
    return { bodies: count((c) => c.body), brands: count((c) => c.brand), fuels: count((c) => c.fuel), gearboxes: count((c) => c.gearbox), years };
  }, [cars]);

  const results = useMemo(() => {
    const words = norm(q).split(/\s+/).filter(Boolean);
    let list = cars.filter((c) => {
      if (cond === "0km" && c.cond !== "0 km") return false;
      if (cond === "usados" && c.cond !== "Usado") return false;
      if (body && c.body !== body) return false;
      if (brands.length && !brands.includes(c.brand)) return false;
      if (fuel && c.fuel !== fuel) return false;
      if (gearbox && c.gearbox !== gearbox) return false;
      if (yearFrom && c.year < Number(yearFrom)) return false;
      if (words.length) {
        const hay = norm(`${c.name} ${c.brand} ${c.model} ${c.year}`);
        if (!words.every((w) => hay.includes(w))) return false;
      }
      return true;
    });
    if (sort === "low") list = [...list].sort(byPrice(1));
    if (sort === "high") list = [...list].sort(byPrice(-1));
    return list;
  }, [cars, q, cond, body, brands, fuel, gearbox, yearFrom, sort]);

  const pages = Math.max(1, Math.ceil(results.length / PER_PAGE));
  const shown = results.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const tags: { label: string; clear: () => void }[] = [];
  if (cond) tags.push({ label: cond === "0km" ? "0 km" : "Usados", clear: () => setCond("") });
  if (body) tags.push({ label: body, clear: () => setBody("") });
  brands.forEach((b) => tags.push({ label: b, clear: () => setBrands((list) => list.filter((x) => x !== b)) }));
  if (fuel) tags.push({ label: fuel, clear: () => setFuel("") });
  if (gearbox) tags.push({ label: gearbox, clear: () => setGearbox("") });
  if (yearFrom) tags.push({ label: `Desde ${yearFrom}`, clear: () => setYearFrom("") });
  if (q.trim()) tags.push({ label: `“${q.trim()}”`, clear: () => setQ("") });

  function reset() {
    setQ(""); setCond(""); setBody(""); setBrands([]); setFuel(""); setGearbox(""); setYearFrom("");
  }

  const goPage = (p: number) => {
    setPage(p);
    document.getElementById("resultados")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <section className="sheet mx-2.5 mt-2.5 lg:mx-8 lg:mt-6">
        <span aria-hidden="true" className="watermark -right-2.5 -top-3.5 text-[120px] lg:-bottom-10 lg:right-6 lg:top-auto lg:text-[220px]">Stock</span>
        <div className="relative flex flex-col gap-5 px-4 pb-4 pt-7 lg:gap-8 lg:px-9 lg:pb-10 lg:pt-12">
          <div className="flex flex-col gap-2.5 px-1.5 lg:gap-3.5 lg:px-0">
            <h1 className="text-[42px] leading-[0.95] tracking-[-0.055em] lg:text-[72px]">Autos disponibles</h1>
            <p className="text-[15px] lg:text-[17px]" style={{ color: "var(--fog)" }}>
              <span className="mono" style={{ color: "var(--paper)" }}>{cars.length}</span> unidades listas para entregar
            </p>
          </div>
          <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center">
            <label className="flex h-14 flex-1 items-center gap-3 rounded-full px-5 lg:h-16 lg:max-w-[640px] lg:px-6" style={{ background: "var(--ink-3)" }}>
              <SearchIcon size={19} className="flex-none" />
              <span className="sr-only">Buscar por marca o modelo</span>
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscá por marca o modelo" className="h-12 w-full bg-transparent text-[16px] outline-none placeholder:text-[var(--ash)]" style={{ color: "var(--paper)" }} />
            </label>
            <span role="radiogroup" aria-label="Condición" className="seg" style={{ background: "var(--ink-3)", padding: 5 }}>
              {CONDS.map((c) => {
                const on = cond === c.id;
                return (
                  <button key={c.id} type="button" role="radio" aria-checked={on} onClick={() => setCond(c.id)} className="flex-1 lg:flex-none" style={{ height: 50, padding: "0 22px", fontSize: 15, ...(on ? { background: "var(--paper)", color: "var(--ink)", fontWeight: 500 } : { color: "var(--silver)" }) }}>
                    {c.label}
                  </button>
                );
              })}
            </span>
          </div>
        </div>
      </section>

      {/* Mobile: carrocerías + botón de filtros */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-2.5 pt-3.5 lg:hidden">
        {[["", "Todas"], ...options.bodies.map(([b]) => [b, b])].map(([id, label]) => (
          <button key={id} type="button" aria-pressed={body === id} onClick={() => setBody(id)} className={`chip flex-none${body === id ? " on" : ""}`} style={body === id ? undefined : { background: "var(--panel)", borderColor: "var(--line)" }}>
            {label}
          </button>
        ))}
      </div>

      <section id="resultados" className="flex scroll-mt-24 items-start gap-6 px-2.5 pt-4 lg:px-16 lg:pt-8">
        {/* Filtros */}
        <aside aria-label="Filtros" className={`panel flex-col gap-7 p-6 lg:sticky lg:top-6 lg:flex lg:w-[320px] lg:flex-none lg:p-7 ${filtersOpen ? "fixed inset-x-2.5 bottom-2.5 top-[82px] z-40 flex overflow-y-auto shadow-2xl" : "hidden"}`}>
          <div className="flex items-center justify-between">
            <span className="text-[22px] font-semibold tracking-[-0.03em]">Filtrar</span>
            <span className="flex items-center gap-3">
              <button type="button" onClick={reset} className="mut py-2 text-[14px] underline underline-offset-4 hover:text-[var(--ink)]">Limpiar</button>
              <button type="button" onClick={() => setFiltersOpen(false)} aria-label="Cerrar filtros" className="flex h-10 w-10 items-center justify-center rounded-full lg:hidden" style={{ background: "var(--mist)" }}><CloseIcon /></button>
            </span>
          </div>
          <fieldset className="hidden flex-col gap-3 lg:flex">
            <legend className="mb-3 text-[14px]">Carrocería</legend>
            <div className="flex flex-wrap gap-2">
              {[["", "Todas"], ...options.bodies.map(([b]) => [b, b])].map(([id, label]) => (
                <button key={id} type="button" aria-pressed={body === id} onClick={() => setBody(id)} className={`chip${body === id ? " on" : ""}`}>{label}</button>
              ))}
            </div>
          </fieldset>
          <fieldset className="flex flex-col gap-1">
            <legend className="mb-3 text-[14px]">Marca</legend>
            {options.brands.map(([b, n]) => (
              <label key={b} className="flex min-h-10 cursor-pointer items-center gap-3 text-[15px]">
                <input type="checkbox" checked={brands.includes(b)} onChange={(e) => setBrands((list) => (e.target.checked ? [...list, b] : list.filter((x) => x !== b)))} />
                {b}
                <span className="mono mut ml-auto text-[12.5px]">{n}</span>
              </label>
            ))}
          </fieldset>
          <label className="field">
            <span>Combustible</span>
            <Select value={fuel} onChange={setFuel} options={[{ value: "", label: "Todos" }, ...options.fuels.map(([f]) => f)]} />
          </label>
          <label className="field">
            <span>Transmisión</span>
            <Select value={gearbox} onChange={setGearbox} options={[{ value: "", label: "Todas" }, ...options.gearboxes.map(([g]) => g)]} />
          </label>
          <label className="field">
            <span>Año desde</span>
            <Select value={yearFrom} onChange={setYearFrom} options={[{ value: "", label: "Cualquiera" }, ...options.years.map(String)]} />
          </label>
          <button type="button" onClick={() => setFiltersOpen(false)} className="btn lg:hidden">Ver {results.length} {results.length === 1 ? "auto" : "autos"}</button>
          <div className="hidden flex-col gap-3.5 rounded-3xl p-[22px] lg:flex" style={{ background: "var(--ink)", color: "var(--paper)" }}>
            <span className="text-[17px] font-medium leading-snug tracking-[-0.02em]">¿No está el que buscás?</span>
            <span className="text-[14px] leading-normal" style={{ color: "var(--fog)" }}>Te avisamos por WhatsApp cuando entre uno parecido.</span>
            <Link href="/contacto?motivo=comprar" className="btn light" style={{ height: 48, fontSize: 14 }}>Avisame</Link>
          </div>
        </aside>

        {/* Resultados */}
        <div className="flex min-w-0 flex-1 flex-col gap-4 lg:gap-5">
          <div className="flex flex-wrap items-center justify-between gap-3 px-2.5 lg:gap-4 lg:px-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="mut text-[14.5px] lg:text-[15px]">
                Mostrando <span className="mono" style={{ color: "var(--ink)" }}>{results.length} {results.length === 1 ? "auto" : "autos"}</span>
              </span>
              {tags.map((t) => (
                <span key={t.label} className="inline-flex h-9 items-center gap-1.5 rounded-full pl-3.5 pr-2 text-[13.5px]" style={{ background: "var(--stone)" }}>
                  {t.label}
                  <button type="button" onClick={t.clear} aria-label={`Quitar filtro ${t.label}`} className="flex h-6 w-6 items-center justify-center rounded-full" style={{ background: "var(--mist)" }}><CloseIcon size={14} /></button>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setFiltersOpen(true)} className="pill-link flex h-11 items-center gap-2 rounded-full border px-4 text-[14px] lg:hidden" style={{ borderColor: "var(--silver)" }}>Filtros</button>
              <span className="flex items-center gap-2.5 whitespace-nowrap text-[14px]">
                <span className="hidden lg:inline" aria-hidden="true">Ordenar por</span>
                <Select compact ariaLabel="Ordenar por" icon={<SortIcon />} value={sort} onChange={setSort} options={SORTS.map((s) => ({ value: s.id, label: s.label }))} />
              </span>
            </div>
          </div>

          {shown.length > 0 ? (
            <div className="grid gap-2.5 sm:grid-cols-2 lg:gap-4 xl:grid-cols-3">
              {shown.map((car) => <CarCard key={car.uuid} car={car} />)}
            </div>
          ) : (
            <div className="panel flex flex-col items-start gap-3 p-8 lg:items-center lg:gap-4 lg:p-14 lg:text-center">
              <span className="text-[21px] font-semibold tracking-[-0.03em] lg:text-[26px]">No hay unidades con esos filtros.</span>
              <span className="mut max-w-[420px] text-[14.5px] leading-normal lg:text-[15.5px]">Probá cambiar la carrocería o la marca. También podemos buscarlo por vos.</span>
              <span className="flex flex-wrap gap-2.5">
                <button type="button" className="btn" onClick={reset}>Limpiar filtros</button>
                <Link href="/contacto?motivo=comprar" className="btn line">Buscámelo</Link>
              </span>
            </div>
          )}

          {pages > 1 && (
            <nav aria-label="Páginas" className="flex flex-wrap justify-center gap-1.5 pt-4">
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) =>
                p === page ? (
                  <span key={p} aria-current="page" className="mono flex h-12 w-12 items-center justify-center rounded-full text-[14px]" style={{ background: "var(--ink)", color: "var(--paper)" }}>{p}</span>
                ) : (
                  <button key={p} type="button" onClick={() => goPage(p)} className="pill-link mono flex h-12 w-12 items-center justify-center rounded-full border text-[14px]" style={{ borderColor: "var(--silver)" }}>{p}</button>
                )
              )}
              {page < pages && (
                <button type="button" onClick={() => goPage(page + 1)} className="pill-link flex h-12 items-center rounded-full border px-5 text-[14px]" style={{ borderColor: "var(--silver)" }}>Siguiente</button>
              )}
            </nav>
          )}

          <Link href="/contacto?motivo=comprar" className="mt-1.5 flex items-center justify-between gap-3.5 rounded-[28px] p-[22px] lg:hidden" style={{ background: "var(--ink)", color: "var(--paper)" }}>
            <span className="flex flex-col gap-1.5">
              <span className="text-[18px] font-medium">¿No está el que buscás?</span>
              <span className="text-[14px]" style={{ color: "var(--fog)" }}>Te avisamos cuando entre uno parecido.</span>
            </span>
            <span className="arrow inv"><ArrowIcon /></span>
          </Link>
        </div>
      </section>
    </>
  );
}
