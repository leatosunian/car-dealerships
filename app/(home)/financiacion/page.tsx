import type { Metadata } from "next";
import { Faq, FinanceSimulator, Requirements } from "@/components/site/FinanceClient";

export const metadata: Metadata = {
  title: "Financiación",
  description: "Simulá tu cuota a tasa fija o UVA. Preaprobación en 24 horas con bancos y financieras.",
};

const steps = [
  { t: "Simulás y elegís", d: "Tasa fija o UVA, el plazo que te quede cómodo y cuánto ponés de anticipo." },
  { t: "Preaprobación en 24 h", d: "Mandás DNI y comprobante de ingresos por WhatsApp. Nosotros armamos la carpeta." },
  { t: "Firmás y te lo llevás", d: "Con la prenda inscripta, el auto sale patentado y con seguro desde el primer día." },
];

const lenders = ["[Banco A]", "[Banco B]", "[Financiera C]", "[Financiera D]"];

export default function FinanciacionPage() {
  return (
    <main>
      <section className="sheet mx-2.5 mt-2.5 lg:mx-8 lg:mt-6">
        <span aria-hidden="true" className="watermark -bottom-5 left-4 text-[110px] lg:-bottom-12 lg:left-6 lg:text-[220px]">Cuotas</span>
        <FinanceSimulator />
      </section>

      <section className="px-2.5 pt-16 lg:px-16 lg:pt-24">
        <h2 className="mb-7 px-2.5 text-[38px] leading-none tracking-[-0.05em] lg:mb-8 lg:px-0 lg:text-[56px]">Así de simple.</h2>
        <ol className="grid gap-2.5 lg:grid-cols-3 lg:gap-5">
          {steps.map((s, i) => (
            <li key={s.t} className="panel flex flex-col gap-8 p-6 lg:gap-10 lg:p-8">
              <span className="mono flex h-11 w-11 items-center justify-center rounded-full text-[14px]" style={{ background: "var(--ink)", color: "var(--paper)" }}>{i + 1}</span>
              <span className="flex flex-col gap-2">
                <span className="text-[21px] font-semibold tracking-[-0.03em] lg:text-[22px]">{s.t}</span>
                <span className="mut text-[15px] leading-normal">{s.d}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section className="flex flex-col gap-2.5 px-2.5 pt-2.5 lg:flex-row lg:items-stretch lg:gap-6 lg:px-16 lg:pt-6">
        <div className="panel flex flex-1 flex-col gap-6 p-6 lg:gap-[26px] lg:p-10">
          <h2 className="text-[26px] tracking-[-0.04em] lg:text-[30px]">Qué necesitás</h2>
          <Requirements />
        </div>
        <div className="flex flex-col gap-[22px] rounded-[28px] p-6 lg:w-[520px] lg:flex-none lg:rounded-[32px] lg:p-10" style={{ background: "var(--stone)" }}>
          <h2 className="text-[26px] tracking-[-0.04em] lg:text-[30px]">Con quién trabajamos</h2>
          <div className="grid grid-cols-2 gap-2.5">
            {lenders.map((l) => (
              <span key={l} className="flex h-[76px] items-center justify-center rounded-3xl text-[16px] font-semibold tracking-[-0.02em] lg:h-[92px] lg:text-[17px]" style={{ background: "var(--panel)" }}>{l}</span>
            ))}
          </div>
          <p className="text-[14.5px] leading-normal" style={{ color: "var(--ink-5)" }}>Las condiciones dependen de cada entidad y de tu perfil crediticio. Te mostramos todas las opciones juntas.</p>
        </div>
      </section>

      <section className="flex flex-col gap-7 px-2.5 pt-16 lg:flex-row lg:items-start lg:gap-16 lg:px-16 lg:pt-24">
        <h2 className="px-2.5 text-[38px] leading-none tracking-[-0.05em] lg:w-[380px] lg:flex-none lg:px-0 lg:text-[56px]">
          Preguntas<br /><span style={{ color: "var(--ash)" }}>frecuentes</span>
        </h2>
        <Faq />
      </section>
    </main>
  );
}
