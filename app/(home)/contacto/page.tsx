import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/site/ContactForm";
import { ArrowIcon } from "@/components/site/icons";
import { branches, site, waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contacto",
  description: "WhatsApp, teléfono y email. Te responde una persona, no un bot.",
};

export default function ContactoPage() {
  const channels = [
    { label: "WhatsApp", title: "Ventas 0km y usados", value: site.whatsappLabel, href: waLink("Hola, quiero consultar por un auto.") },
    { label: "WhatsApp", title: "Tasación de usados", value: site.whatsappLabel, href: waLink("Hola, quiero cotizar mi usado.") },
    { label: "Teléfono", title: "Atención general", value: site.phone, href: `tel:${site.phone.replace(/[^\d+]/g, "")}` },
    { label: "Email", title: "Consultas y reclamos", value: site.email, href: `mailto:${site.email.replace(/[[\]]/g, "")}` },
  ];

  return (
    <main>
      <section className="sheet mx-2.5 mt-2.5 lg:mx-8 lg:mt-6">
        <div className="flex flex-col gap-6 p-2 pt-7 lg:flex-row lg:items-end lg:gap-10 lg:py-7 lg:pl-9 lg:pr-7">
          <div className="flex flex-1 flex-col gap-[22px] px-4 lg:px-0 lg:pb-2 lg:pt-7">
            <h1 className="text-[64px] leading-[0.9] tracking-[-0.065em] lg:text-[120px]">Hablemos.</h1>
            <p className="max-w-[460px] text-[15.5px] leading-relaxed lg:text-[17px]" style={{ color: "var(--fog)" }}>
              Te responde una persona, no un bot. Por WhatsApp contestamos en minutos dentro del horario de atención.
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:w-[56%] lg:flex-none xl:w-[680px] lg:gap-2.5">
            {channels.map((c) => (
              <a key={c.title} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="lift flex min-h-[150px] flex-col justify-between gap-[18px] rounded-[24px] p-[22px] lg:min-h-[170px] lg:rounded-[28px] lg:p-6" style={{ background: "var(--ink-2)" }}>
                <span className="flex items-center justify-between">
                  <span className="text-[14px]" style={{ color: "var(--fog)" }}>{c.label}</span>
                  <span className="arrow inv"><ArrowIcon /></span>
                </span>
                <span className="flex flex-col gap-1.5">
                  <span className="text-[20px] font-semibold tracking-[-0.03em] lg:text-[22px]">{c.title}</span>
                  <span className="mono text-[13px]" style={{ color: "var(--silver)" }}>{c.value}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="flex flex-col items-start gap-2.5 px-2.5 pt-2.5 lg:flex-row lg:gap-6 lg:px-16 lg:pt-8">
        <div className="w-full min-w-0 flex-1 rounded-[28px] bg-white p-5 lg:rounded-[32px] lg:p-10" style={{ boxShadow: "0 1px 0 var(--stone)" }}>
          <ContactForm />
        </div>

        <aside className="flex w-full flex-col gap-2.5 lg:w-[420px] lg:flex-none lg:gap-4">
          <div className="panel flex flex-col gap-[18px] p-6 lg:p-8">
            <h2 className="text-[22px] tracking-[-0.03em] lg:text-[24px]">Horarios de atención</h2>
            <dl className="flex flex-col">
              {site.hours.map((h) => (
                <div key={h.d} className="flex justify-between border-t py-3.5 text-[15px]" style={{ borderColor: "var(--stone)" }}>
                  <dt>{h.d}</dt><dd className="mono text-[14px]">{h.h}</dd>
                </div>
              ))}
            </dl>
            <Link href="/nosotros#sucursales" className="row-link text-[15px] font-medium">Ver las {branches.length} sucursales<span className="arrow"><ArrowIcon /></span></Link>
          </div>
          <div id="arrepentimiento" className="flex scroll-mt-24 flex-col gap-4 rounded-[28px] p-6 lg:rounded-[32px] lg:p-8" style={{ background: "var(--ink)", color: "var(--paper)" }}>
            <h2 className="text-[22px] tracking-[-0.03em] lg:text-[24px]">Botón de arrepentimiento</h2>
            <p className="text-[14.5px] leading-relaxed" style={{ color: "var(--fog)" }}>Si contrataste un servicio a distancia, tenés 10 días corridos para revocar la aceptación (Res. 424/2020).</p>
            <a href={`mailto:${site.email.replace(/[[\]]/g, "")}?subject=${encodeURIComponent("Botón de arrepentimiento")}`} className="btn light">Quiero arrepentirme</a>
          </div>
          <a href="https://www.argentina.gob.ar/produccion/defensadelconsumidor" target="_blank" rel="noopener noreferrer" className="panel row-link py-[22px] pl-7 pr-4 text-[15px]">
            Defensa del Consumidor<span className="arrow"><ArrowIcon /></span>
          </a>
        </aside>
      </section>
    </main>
  );
}
