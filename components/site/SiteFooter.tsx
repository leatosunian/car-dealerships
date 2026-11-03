import Link from "next/link";
import { site, waLink } from "@/lib/site";
import { Mark, WaIcon } from "./icons";

const columns = [
  { title: "Comprar", links: [["/vehicles", "Todo el stock"], ["/vehicles?cond=0km", "0 km"], ["/vehicles?cond=usados", "Usados seleccionados"], ["/financiacion", "Financiación"]] },
  { title: "Vender", links: [["/cotizar", "Cotizá tu usado"], ["/cotizar", "Usado como parte de pago"], ["/cotizar#que-traer", "Qué documentación llevar"]] },
  { title: site.name, links: [["/nosotros", "Nosotros"], ["/nosotros#sucursales", "Sucursales"], ["/contacto", "Contacto"]] },
  { title: "Legales", links: [["/contacto#arrepentimiento", "Botón de arrepentimiento"], ["https://www.argentina.gob.ar/produccion/defensadelconsumidor", "Defensa del Consumidor"], ["#", "Datos fiscales (ARCA)"], ["#", "Privacidad · Ley 25.326"]] },
];

export default function SiteFooter() {
  return (
    <footer className="relative mx-2.5 mb-2.5 mt-14 overflow-hidden rounded-[32px] px-[22px] pb-28 pt-8 lg:mx-8 lg:mb-8 lg:mt-24 lg:rounded-[40px] lg:px-12 lg:pb-9 lg:pt-14" style={{ background: "var(--ink)", color: "var(--fog)" }}>
      <span aria-hidden="true" className="watermark -bottom-7 left-3.5 text-[118px] lg:-bottom-16 lg:left-auto lg:-right-6 lg:text-[300px]">{site.name}</span>
      <div className="relative flex flex-col gap-10 lg:flex-row lg:justify-between lg:gap-12">
        <div className="flex flex-col gap-[22px] lg:w-[360px]">
          <Link href="/" aria-label={`${site.fullName}, inicio`} className="flex items-center gap-3.5" style={{ color: "var(--paper)" }}>
            <Mark size={46} radius={15} font={17} />
            <span className="text-[20px] font-semibold tracking-[-0.02em]">{site.fullName}</span>
          </Link>
          <p className="text-[15px] leading-relaxed">0km de todas las marcas y usados seleccionados. Tomamos tu auto y financiamos en el día.</p>
          <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn light self-start">
            <WaIcon />Escribinos por WhatsApp
          </a>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 lg:flex lg:gap-[72px]">
          {columns.map((col) => (
            <div key={col.title} className="flex flex-col gap-3.5">
              <span className="text-[14.5px] font-medium" style={{ color: "var(--paper)" }}>{col.title}</span>
              {col.links.map(([href, label]) =>
                href.startsWith("http") ? (
                  <a key={label} className="fl" href={href} target="_blank" rel="noopener noreferrer">{label}</a>
                ) : (
                  <Link key={label} className="fl" href={href}>{label}</Link>
                )
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="relative mt-12 flex flex-col gap-2 border-t pt-6 text-[12.5px] leading-relaxed lg:mt-[120px] lg:flex-row lg:justify-between lg:text-[13px]" style={{ borderColor: "var(--ink-4)", color: "var(--ash)" }}>
        <span>© {new Date().getFullYear()} {site.legalName} · CUIT {site.cuit} · Concesionario oficial {site.officialBrands}</span>
        <span>Precios sujetos a cambio sin previo aviso. Fotos de carácter ilustrativo.</span>
      </div>
    </footer>
  );
}
