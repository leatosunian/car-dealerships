"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { branches } from "@/lib/site";
import { ArrowIcon, CheckIcon } from "./icons";
import Select from "./Select";

const BRANDS = ["Chevrolet", "Citroën", "Fiat", "Ford", "Honda", "Jeep", "Nissan", "Peugeot", "Renault", "Toyota", "Volkswagen", "Otra"];
const thisYear = new Date().getFullYear();
const YEARS = Array.from({ length: 20 }, (_, i) => String(thisYear - i));
const STEPS = ["Tu auto", "Estado", "Tus datos"];
const TITLES = ["Contanos de tu auto", "¿En qué estado está?", "¿Cómo te contactamos?", "Listo, recibimos tus datos"];

type Form = {
  brand: string; model: string; year: string; km: string; fuel: string; gearbox: string;
  crashes: string; services: string;
  name: string; phone: string; email: string; branch: string; tradeIn: boolean;
};

export default function QuoteWizard() {
  const params = useSearchParams();
  const initialBrand = params.get("brand") ?? "";
  const [step, setStep] = useState(1);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);
  const [f, setF] = useState<Form>({
    brand: BRANDS.includes(initialBrand) ? initialBrand : "",
    model: "",
    year: YEARS.includes(params.get("year") ?? "") ? params.get("year")! : "",
    km: params.get("km") ?? "",
    fuel: "Nafta",
    gearbox: "Manual",
    crashes: "Nunca",
    services: "Oficiales al día",
    name: "",
    phone: "",
    email: "",
    branch: branches[0]?.name ?? "",
    tradeIn: true,
  });
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((prev) => ({ ...prev, [k]: v }));

  const missing: Partial<Record<keyof Form, boolean>> =
    step === 1
      ? { brand: !f.brand, model: !f.model.trim(), year: !f.year, km: !f.km.trim() }
      : step === 3
        ? { name: !f.name.trim(), phone: f.phone.replace(/\D/g, "").length < 8 }
        : {};
  const invalid = (k: keyof Form) => touched && !!missing[k];

  async function next() {
    setTouched(true);
    if (Object.values(missing).some(Boolean)) return;
    setTouched(false);
    if (step < 3) return setStep(step + 1);

    setSending(true);
    setError("");
    const [name, ...rest] = f.name.trim().split(/\s+/);
    const details = [
      `${f.brand} ${f.model.trim()}`,
      `${f.fuel}, ${f.gearbox.toLowerCase()}`,
      `Choques: ${f.crashes}`,
      `Services: ${f.services}`,
      `Sucursal: ${f.branch}`,
      f.tradeIn ? "Lo quiere usar como parte de pago" : "Quiere venderlo",
      f.email ? `Email: ${f.email}` : "",
    ].filter(Boolean).join(" · ");
    try {
      const res = await fetch("/api/leads/page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, surname: rest.join(" ") || "-", phone: f.phone.trim(), vehicleInfo: details, vehicleYear: f.year, vehicleKm: f.km }),
      });
      const data = await res.json();
      if (!res.ok || data.msg !== "QUESTION_CREATED") throw new Error(data.msg);
      setStep(4);
    } catch {
      setError("No pudimos enviar tus datos. Probá de nuevo o escribinos por WhatsApp.");
    } finally {
      setSending(false);
    }
  }

  function restart() {
    setF((prev) => ({ ...prev, brand: "", model: "", year: "", km: "" }));
    setStep(1);
  }

  return (
    <div id="cotizador" className="flex min-w-0 flex-1 scroll-mt-24 flex-col gap-7 rounded-[28px] bg-white p-5 lg:gap-8 lg:rounded-[32px] lg:p-10" style={{ boxShadow: "0 1px 0 var(--stone)" }}>
      <div className="flex flex-col gap-3.5">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-[24px] tracking-[-0.04em] lg:text-[30px]">{TITLES[step - 1]}</h2>
          <span className="mono mut whitespace-nowrap text-[13px]">{step < 4 ? `Paso ${step} de 3` : "Enviado"}</span>
        </div>
        <ol aria-label="Progreso" className="grid grid-cols-3 gap-1.5">
          {STEPS.map((label, i) => (
            <li key={label} aria-current={step === i + 1 ? "step" : undefined} className="flex h-11 items-center justify-center rounded-full text-[13.5px] lg:text-[14px]" style={step >= i + 1 ? { background: "var(--ink)", color: "var(--paper)" } : { background: "var(--mist)", color: "var(--muted)" }}>
              {label}
            </li>
          ))}
        </ol>
      </div>

      {step === 1 && (
        <div className="grid gap-[18px] sm:grid-cols-2">
          <label className="field"><span>Marca</span>
            <Select value={f.brand} onChange={(v) => set("brand", v)} options={BRANDS} placeholder="Elegí la marca" invalid={invalid("brand")} />
          </label>
          <label className="field"><span>Modelo y versión</span>
            <input className="input" placeholder="Ej.: Corolla 2.0 XEi CVT" value={f.model} onChange={(e) => set("model", e.target.value)} aria-invalid={invalid("model")} />
          </label>
          <label className="field"><span>Año</span>
            <Select value={f.year} onChange={(v) => set("year", v)} options={YEARS} placeholder="Elegí el año" invalid={invalid("year")} />
          </label>
          <label className="field"><span>Kilómetros</span>
            <input className="input" inputMode="numeric" placeholder="45.000" value={f.km} onChange={(e) => set("km", e.target.value.replace(/[^\d.]/g, ""))} aria-invalid={invalid("km")} />
          </label>
          <label className="field"><span>Combustible</span>
            <Select value={f.fuel} onChange={(v) => set("fuel", v)} options={["Nafta", "Diésel", "GNC", "Híbrido"]} />
          </label>
          <label className="field"><span>Transmisión</span>
            <Select value={f.gearbox} onChange={(v) => set("gearbox", v)} options={["Manual", "Automática"]} />
          </label>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-[26px]">
          {([
            ["crashes", "¿Tuvo choques?", ["Nunca", "Detalles leves", "Choque reparado"]],
            ["services", "Services", ["Oficiales al día", "Taller particular", "No sé"]],
          ] as const).map(([key, legend, opts]) => (
            <fieldset key={key} className="grid gap-2 sm:grid-cols-3">
              <legend className="mb-3 text-[14px]">{legend}</legend>
              {opts.map((o) => (
                <label key={o} className="opt">
                  <input type="radio" name={key} checked={f[key] === o} onChange={() => set(key, o)} />{o}
                </label>
              ))}
            </fieldset>
          ))}
        </div>
      )}

      {step === 3 && (
        <div className="grid gap-[18px] sm:grid-cols-2">
          <label className="field"><span>Nombre y apellido</span>
            <input className="input" autoComplete="name" value={f.name} onChange={(e) => set("name", e.target.value)} aria-invalid={invalid("name")} />
          </label>
          <label className="field"><span>WhatsApp</span>
            <input className="input" type="tel" placeholder="11 0000 0000" autoComplete="tel" value={f.phone} onChange={(e) => set("phone", e.target.value)} aria-invalid={invalid("phone")} />
          </label>
          <label className="field"><span>Email (opcional)</span>
            <input className="input" type="email" autoComplete="email" value={f.email} onChange={(e) => set("email", e.target.value)} />
          </label>
          <label className="field"><span>Sucursal para la revisión</span>
            <Select value={f.branch} onChange={(v) => set("branch", v)} options={branches.map((b) => b.name)} />
          </label>
          <label className="flex min-h-14 cursor-pointer items-center gap-3.5 rounded-[20px] px-5 py-3 text-[15px] sm:col-span-2" style={{ background: "var(--panel)" }}>
            <input type="checkbox" checked={f.tradeIn} onChange={(e) => set("tradeIn", e.target.checked)} />Quiero usarlo como parte de pago de otro auto
          </label>
          <p className="mut text-[13px] leading-relaxed sm:col-span-2">Usamos tus datos solo para enviarte la cotización (Ley 25.326). No los compartimos con terceros.</p>
        </div>
      )}

      {step === 4 && (
        <div className="flex flex-col items-start gap-4">
          <span className="flex h-[60px] w-[60px] items-center justify-center rounded-full" style={{ background: "var(--ink)", color: "var(--paper)" }}><CheckIcon size={26} /></span>
          <p className="mut max-w-[560px] text-[16px] leading-relaxed lg:text-[17px]">
            Un tasador te escribe por WhatsApp en menos de [2 horas hábiles] con un rango de precio para tu {f.brand} y para coordinar la revisión.
          </p>
          <div className="flex flex-wrap gap-2.5">
            <Link href="/vehicles" className="btn go">Mirar el stock<span className="arrow"><ArrowIcon /></span></Link>
            <button type="button" className="btn line" onClick={restart}>Cotizar otro auto</button>
          </div>
        </div>
      )}

      {touched && Object.values(missing).some(Boolean) && <p className="err" role="alert">Completá los campos marcados para seguir.</p>}
      {error && <p className="err" role="alert">{error}</p>}

      {step < 4 && (
        <div className="flex items-center justify-between gap-3 border-t pt-6" style={{ borderColor: "var(--mist)" }}>
          {step > 1 ? (
            <button type="button" className="btn line" onClick={() => { setTouched(false); setStep(step - 1); }}>Atrás</button>
          ) : (
            <span className="mut text-[14px]">Tarda menos de 2 minutos</span>
          )}
          <button type="button" className="btn go" onClick={next} disabled={sending}>
            {step === 3 ? (sending ? "Enviando…" : "Enviar") : "Continuar"}
            <span className="arrow"><ArrowIcon /></span>
          </button>
        </div>
      )}
    </div>
  );
}
