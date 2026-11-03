"use client";
import Link from "next/link";
import { useState } from "react";
import { cuotaFrancesa, pesos, site, tnaLabel } from "@/lib/site";
import { CheckIcon } from "./icons";

const TIPOS = [
  { id: "fija", label: "Tasa fija en pesos", hint: "La cuota no cambia en todo el plazo" },
  { id: "uva", label: "Crédito UVA", hint: "Cuota inicial más baja, ajusta por inflación" },
] as const;
const PLAZOS = [12, 24, 36, 48, 60];

export function FinanceSimulator() {
  const [tipo, setTipo] = useState<"fija" | "uva">("fija");
  const [precio, setPrecio] = useState(30_000_000);
  const [anticipo, setAnticipo] = useState(50);
  const [plazo, setPlazo] = useState(36);

  const tna = tipo === "fija" ? site.tnaFija : site.tnaUva;
  const financiado = (precio * (100 - anticipo)) / 100;
  const cuota = cuotaFrancesa(financiado, tna, plazo);

  return (
    <div className="flex flex-col gap-6 p-2 pt-7 lg:flex-row lg:gap-10 lg:py-7 lg:pl-9 lg:pr-7">
      <div className="relative flex flex-1 flex-col gap-7 px-4 lg:px-0 lg:pt-7">
        <h1 className="text-[46px] leading-[0.95] tracking-[-0.055em] lg:text-[76px]">
          Financiá tu auto.<br /><span style={{ color: "var(--ash)" }}>Sin letra chica.</span>
        </h1>
        <p className="max-w-[500px] text-[15.5px] leading-relaxed lg:text-[17px]" style={{ color: "var(--fog)" }}>
          Comparamos [4] bancos y financieras por vos. Ves la cuota, la tasa y el costo financiero total antes de firmar nada.
        </p>
        <div role="radiogroup" aria-label="Tipo de crédito" className="flex max-w-[500px] flex-col gap-2">
          {TIPOS.map((t) => {
            const on = tipo === t.id;
            return (
              <button
                key={t.id}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setTipo(t.id)}
                className="tipo flex min-h-[76px] items-center justify-between gap-4 rounded-[26px] py-3 pl-6 pr-3 text-left"
                style={on ? { background: "var(--paper)", color: "var(--ink)" } : { border: "1px solid var(--ink-5)", color: "var(--paper)" }}
              >
                <span className="flex flex-col gap-1">
                  <span className="text-[17px] font-semibold tracking-[-0.02em] lg:text-[18px]">{t.label}</span>
                  <span className="text-[14px]" style={{ color: on ? "var(--muted)" : "var(--fog)" }}>{t.hint}</span>
                </span>
                <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full" style={on ? { background: "var(--ink)", color: "var(--paper)" } : { border: "1px solid var(--ink-5)" }}>
                  {on && <CheckIcon size={18} />}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative flex flex-col gap-[26px] rounded-[26px] p-5 lg:w-[50%] lg:flex-none xl:w-[600px] lg:rounded-[32px] lg:p-[34px]" style={{ background: "var(--paper)", color: "var(--ink)" }}>
        <div className="flex flex-col gap-3">
          <label htmlFor="fs-precio" className="flex justify-between text-[14.5px]"><span>Precio del auto</span><span className="mono">{pesos(precio)}</span></label>
          <input id="fs-precio" type="range" min={5_000_000} max={120_000_000} step={1_000_000} value={precio} onChange={(e) => setPrecio(Number(e.target.value))} />
        </div>
        <div className="flex flex-col gap-3">
          <label htmlFor="fs-ant" className="flex justify-between text-[14.5px]"><span>Anticipo · {anticipo}%</span><span className="mono">{pesos((precio * anticipo) / 100)}</span></label>
          <input id="fs-ant" type="range" min={30} max={90} step={5} value={anticipo} onChange={(e) => setAnticipo(Number(e.target.value))} />
          <span className="mut text-[13px]">Tu usado puede ser parte del anticipo.</span>
        </div>
        <div className="flex flex-col gap-3">
          <span id="fs-plazo" className="text-[14.5px]">Plazo en meses</span>
          <div role="radiogroup" aria-labelledby="fs-plazo" className="grid grid-cols-5 gap-1.5">
            {PLAZOS.map((p) => (
              <button key={p} type="button" role="radio" aria-checked={plazo === p} onClick={() => setPlazo(p)} className={`chip mono${plazo === p ? " on" : ""}`} style={{ padding: 0, fontSize: 13.5 }}>{p}</button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-[18px] rounded-[26px] p-6 lg:p-[26px]" style={{ background: "var(--ink)", color: "var(--paper)" }}>
          <span className="flex flex-col gap-1.5">
            <span className="text-[14px]" style={{ color: "var(--fog)" }}>{tipo === "fija" ? "Cuota mensual fija" : "Primera cuota (ajusta por UVA)"}</span>
            <span className="text-[42px] font-semibold leading-none tracking-[-0.05em] lg:text-[58px]">{pesos(cuota)}</span>
          </span>
          <dl className="grid grid-cols-3 gap-3 border-t pt-4" style={{ borderColor: "var(--ink-4)" }}>
            {[
              ["Financiás", pesos(financiado)],
              ["TNA", tnaLabel(tna) + (tipo === "uva" ? " + UVA" : "")],
              ["CFTEA c/IVA", "[00,00%]"],
            ].map(([k, v]) => (
              <div key={k} className="flex flex-col gap-1">
                <dt className="text-[12.5px]" style={{ color: "var(--ash)" }}>{k}</dt>
                <dd className="mono text-[13px] lg:text-[14px]">{v}</dd>
              </div>
            ))}
          </dl>
          <Link href="/contacto?motivo=financiacion" className="btn light">Pedir preaprobación en 24 h</Link>
        </div>
      </div>
    </div>
  );
}

const PERFILES = [
  { label: "En relación de dependencia", short: "Empleado", docs: ["DNI vigente", "Últimos 3 recibos de sueldo", "Antigüedad laboral mínima de [6] meses", "Servicio a tu nombre (luz, gas o internet)"] },
  { label: "Monotributista", short: "Monotributo", docs: ["DNI vigente", "Constancia de inscripción en ARCA", "Últimos 6 pagos del monotributo", "Antigüedad mínima de [12] meses en la categoría"] },
  { label: "Autónomo", short: "Autónomo", docs: ["DNI vigente", "Última declaración jurada de Ganancias", "Certificación de ingresos firmada por contador", "Constancia de inscripción en ARCA"] },
];

export function Requirements() {
  const [i, setI] = useState(0);
  return (
    <>
      <div role="tablist" aria-label="Situación laboral" className="seg self-stretch lg:self-start" style={{ background: "var(--mist)", padding: 5 }}>
        {PERFILES.map((p, j) => (
          <button key={p.label} type="button" role="tab" aria-selected={i === j} onClick={() => setI(j)} className="flex-1 lg:flex-none" style={{ height: 46, padding: "0 18px", fontSize: 14.5, ...(i === j ? { background: "var(--ink)", color: "var(--paper)" } : { color: "var(--ink-5)" }) }}>
            <span className="lg:hidden">{p.short}</span><span className="hidden lg:inline">{p.label}</span>
          </button>
        ))}
      </div>
      <ul role="tabpanel" className="flex flex-col">
        {PERFILES[i].docs.map((d) => (
          <li key={d} className="flex items-center gap-3.5 border-t py-4 text-[15px] lg:text-[15.5px]" style={{ borderColor: "var(--stone)" }}>
            <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full" style={{ background: "var(--ink)", color: "var(--paper)" }}><CheckIcon size={13} /></span>{d}
          </li>
        ))}
      </ul>
    </>
  );
}

const FAQS = [
  { q: "¿Puedo financiar un usado?", a: "Sí. Financiamos usados de hasta [10] años de antigüedad, con un tope del [70]% del valor según la entidad." },
  { q: "¿Qué pasa si quiero cancelar antes?", a: "Podés cancelar total o parcialmente cuando quieras. Si hay comisión por cancelación anticipada, te la informamos antes de firmar." },
  { q: "¿Necesito cuenta en el banco?", a: "No siempre. Trabajamos con financieras que no exigen cuenta bancaria ni otros productos." },
  { q: "¿Puedo usar mi auto como anticipo?", a: "Sí. Lo tasamos y su valor se descuenta del precio. Lo que quede, lo financiás." },
  { q: "¿Qué es el CFT y por qué importa?", a: "El Costo Financiero Total suma tasa, seguros, gastos e impuestos. Es el número real para comparar créditos, y siempre te lo damos por escrito." },
];

export function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <div className="flex flex-1 flex-col gap-2.5">
      {FAQS.map((f, i) => {
        const on = open === i;
        return (
          <div key={f.q} className="panel faq-item" style={{ borderRadius: 26 }}>
            <button
              type="button"
              onClick={() => setOpen(on ? -1 : i)}
              aria-expanded={on}
              aria-controls={`faq-${i}`}
              className="flex min-h-[76px] w-full items-center justify-between gap-5 py-3 pl-6 pr-3.5 text-left text-[17px] font-medium tracking-[-0.02em] lg:pl-7 lg:text-[18px]"
            >
              {f.q}
              <span className="flex h-12 w-12 flex-none items-center justify-center rounded-full text-[22px]" style={on ? { background: "var(--ink)", color: "var(--paper)" } : { background: "var(--mist)" }}>{on ? "−" : "+"}</span>
            </button>
            {on && <p id={`faq-${i}`} className="mut px-6 pb-[26px] text-[15.5px] leading-relaxed lg:pl-7 lg:pr-[90px] lg:text-[16px]">{f.a}</p>}
          </div>
        );
      })}
      <p className="mono mut px-2 pt-[18px] text-[12px] leading-[1.7]">
        Valores de referencia, sistema de amortización francés. No constituyen oferta de crédito. CFTEA con IVA informado en cada propuesta según normativa del BCRA. Sujeto a aprobación crediticia de la entidad.
      </p>
    </div>
  );
}
