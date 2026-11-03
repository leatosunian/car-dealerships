import type { Metadata } from "next";
import Image from "next/image";
import QuoteWizard from "@/components/site/QuoteWizard";
import pickupImg from "@/public/images/c5.jpg";

export const metadata: Metadata = {
  title: "Vendé tu usado",
  description: "Cotizá tu usado en dos minutos. Oferta firme después de una revisión de 40 minutos, pago en el día o como parte de pago.",
};

const nextSteps = [
  { t: "Te escribe un tasador", d: "Con los datos que cargás te pasamos un rango según el mercado de esta semana." },
  { t: "Revisión de 40 minutos", d: "En la sucursal que elijas, con turno." },
  { t: "Oferta firme y pago", d: "Transferencia en el día o descuento sobre tu próximo auto." },
];

const docs = ["Título", "Cédula", "DNI del titular", "VTV vigente", "Libre deuda", "Duplicado de llave"];

export default function CotizarPage() {
  return (
    <main>
      <section className="sheet mx-2.5 mt-2.5 lg:mx-8 lg:mt-6">
        <div className="flex flex-col gap-6 p-2 pt-7 lg:flex-row lg:items-stretch lg:gap-10 lg:py-7 lg:pl-9 lg:pr-7">
          <div className="flex flex-1 flex-col justify-between gap-6 px-4 lg:gap-10 lg:px-0 lg:pb-3 lg:pt-7">
            <div className="flex flex-col gap-[22px]">
              <h1 className="text-[46px] leading-[0.95] tracking-[-0.055em] lg:text-[76px]">
                Tu usado,<br /><span style={{ color: "var(--ash)" }}>cotizado hoy.</span>
              </h1>
              <p className="max-w-[480px] text-[15.5px] leading-relaxed lg:text-[17px]" style={{ color: "var(--fog)" }}>
                Cargás los datos y un tasador te pasa un rango por WhatsApp. La oferta firme llega después de revisarlo 40 minutos. Lo vendés o lo dejás como parte de pago: vos decidís.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="dchip"><span className="dot" />Pago en el día</span>
              <span className="dchip">Nos ocupamos del 08</span>
              <span className="dchip">Todas las marcas</span>
            </div>
          </div>
          <div className="relative h-[240px] flex-none overflow-hidden rounded-[26px] lg:h-[460px] lg:w-[46%] xl:w-[640px] lg:rounded-[30px]" style={{ background: "var(--ink-3)" }}>
            <Image src={pickupImg} alt="" fill priority sizes="(min-width: 1024px) 640px, 95vw" className="object-cover" />
            <span className="glass absolute bottom-3.5 right-3.5 flex flex-col gap-1 rounded-[22px] px-5 py-4">
              <span className="text-[13px]" style={{ color: "var(--silver)" }}>Tomamos usados de hasta</span>
              <span className="text-[24px] font-semibold tracking-[-0.03em] lg:text-[26px]">[15] años</span>
            </span>
          </div>
        </div>
      </section>

      <section className="flex flex-col items-start gap-2.5 px-2.5 pt-2.5 lg:flex-row lg:gap-6 lg:px-16 lg:pt-8">
        <QuoteWizard />
        <aside className="flex w-full flex-col gap-2.5 lg:w-[420px] lg:flex-none lg:gap-4">
          <div className="panel flex flex-col gap-5 p-6 lg:p-8">
            <h2 className="text-[22px] tracking-[-0.03em] lg:text-[24px]">Cómo sigue</h2>
            <ol className="flex flex-col gap-[18px]">
              {nextSteps.map((s, i) => (
                <li key={s.t} className="flex gap-4">
                  <span className="mono flex h-9 w-9 flex-none items-center justify-center rounded-full text-[13px]" style={{ background: "var(--ink)", color: "var(--paper)" }}>{i + 1}</span>
                  <span className="flex flex-col gap-1">
                    <span className="text-[15.5px] font-medium">{s.t}</span>
                    <span className="mut text-[14px] leading-normal">{s.d}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div id="que-traer" className="panel flex scroll-mt-24 flex-col gap-4 p-6 lg:p-8">
            <h2 className="text-[22px] tracking-[-0.03em] lg:text-[24px]">Qué traer</h2>
            <ul className="flex flex-wrap gap-2">
              {docs.map((d) => (
                <li key={d} className="flex h-10 items-center rounded-full border bg-white px-4 text-[14px]" style={{ borderColor: "var(--line)" }}>{d}</li>
              ))}
            </ul>
            <p className="mut text-[14px] leading-normal">El formulario 08 y la verificación policial los gestionamos nosotros.</p>
          </div>
        </aside>
      </section>
    </main>
  );
}
