import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import BranchTabs from "@/components/site/BranchTabs";
import { ArrowIcon, InspectIcon, TagIcon, WrenchIcon } from "@/components/site/icons";
import { branches, site } from "@/lib/site";
import showroomImg from "@/public/images/c8.jpg";
import wheelImg from "@/public/images/i2.jpg";

export const metadata: Metadata = {
  title: "Nosotros y sucursales",
  description: "Quiénes somos, cómo elegimos cada usado y dónde están nuestras sucursales.",
};

const values = [
  { icon: <InspectIcon />, t: "Revisamos todo antes de publicarlo", d: "Si un usado no pasa nuestra revisión, no lo vendemos. Así de simple." },
  { icon: <TagIcon />, t: "El precio es el precio", d: "Publicamos el valor real y detallamos los gastos antes de que reserves." },
  { icon: <WrenchIcon />, t: "Seguimos después de la venta", d: "Taller propio, services oficiales y un asesor que te atiende el teléfono." },
];

export default function NosotrosPage() {
  const stats = [
    { k: "años en el rubro", v: "[28]" },
    { k: "autos entregados", v: "[12 mil]" },
    { k: "sucursales", v: String(branches.length) },
  ];

  return (
    <main>
      <section className="sheet mx-2.5 mt-2.5 lg:mx-8 lg:mt-6">
        <div className="flex flex-col-reverse gap-2 p-2 lg:flex-row lg:gap-10 lg:py-7 lg:pl-9 lg:pr-7">
          <div className="flex flex-1 flex-col justify-between gap-8 px-3.5 pb-3.5 pt-5 lg:gap-10 lg:px-0 lg:pb-0 lg:pt-7">
            <div className="flex flex-col gap-4 lg:gap-6">
              <h1 className="text-[38px] leading-[0.97] tracking-[-0.055em] lg:text-[72px] lg:leading-[0.95]">
                Vendemos autos<br className="hidden lg:block" /> desde {site.since}.<br /><span style={{ color: "var(--ash)" }}>Con el mismo criterio.</span>
              </h1>
              <p className="max-w-[500px] text-[15px] leading-relaxed lg:text-[17px]" style={{ color: "var(--fog)" }}>
                Empezamos como una agencia familiar en [Zona Norte]. Hoy somos concesionario oficial de {site.officialBrands} y tenemos {branches.length} sucursales, pero seguimos eligiendo cada usado como si fuera para nosotros.
              </p>
            </div>
            <dl className="grid grid-cols-3 gap-1.5 lg:gap-2.5">
              {stats.map((s) => (
                <div key={s.k} className="flex flex-col-reverse gap-1 rounded-[20px] p-3.5 lg:gap-1.5 lg:rounded-3xl lg:p-[22px]" style={{ background: "var(--ink-2)" }}>
                  <dt className="text-[12px] lg:text-[14px]" style={{ color: "var(--fog)" }}>{s.k}</dt>
                  <dd className="text-[24px] font-semibold tracking-[-0.04em] lg:text-[40px] lg:tracking-[-0.05em]">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative h-[260px] flex-none overflow-hidden rounded-[26px] lg:h-[600px] lg:w-[44%] xl:w-[600px] lg:rounded-[30px]" style={{ background: "var(--ink-3)" }}>
            <Image src={showroomImg} alt="Showroom de la concesionaria" fill priority sizes="(min-width: 1024px) 600px, 95vw" className="object-cover" />
            <span className="glass absolute bottom-3.5 left-3.5 flex h-10 items-center rounded-full px-4 text-[13.5px]">Showroom {branches[0]?.name}</span>
          </div>
        </div>
      </section>

      <section className="px-2.5 pt-16 lg:px-16 lg:pt-24">
        <h2 className="mb-5 px-2.5 text-[34px] leading-none tracking-[-0.05em] lg:mb-8 lg:px-0 lg:text-[56px]">Lo que no negociamos.</h2>
        <div className="grid gap-2 lg:grid-cols-3 lg:gap-5">
          {values.map((v) => (
            <div key={v.t} className="panel flex items-start gap-4 p-[22px] lg:min-h-[320px] lg:flex-col lg:justify-between lg:p-8">
              <span className="flex h-12 w-12 flex-none items-center justify-center rounded-[17px] lg:h-16 lg:w-16 lg:rounded-[22px]" style={{ background: "var(--ink)", color: "var(--paper)" }}>{v.icon}</span>
              <span className="flex flex-col gap-1.5 lg:gap-2.5">
                <span className="text-[18px] font-semibold tracking-[-0.02em] lg:text-[24px] lg:tracking-[-0.03em]">{v.t}</span>
                <span className="mut text-[14.5px] leading-normal lg:text-[15.5px]">{v.d}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      <section id="sucursales" className="scroll-mt-24 px-2.5 pt-16 lg:px-16 lg:pt-24">
        <div className="mb-5 flex flex-col gap-3 px-2.5 lg:mb-8 lg:flex-row lg:items-end lg:justify-between lg:px-0">
          <h2 className="text-[34px] leading-none tracking-[-0.05em] lg:text-[56px]">Sucursales</h2>
          <p className="mut max-w-[380px] text-[15px] leading-normal lg:text-[16px]">Todas tienen stock propio. Si el auto que te gusta está en otra, lo traemos sin cargo.</p>
        </div>
        <BranchTabs />
      </section>

      <section className="px-2.5 pt-2.5 lg:px-16 lg:pt-6">
        <div className="flex flex-col gap-2 rounded-[28px] p-2 lg:flex-row lg:gap-3 lg:rounded-[32px] lg:p-3" style={{ background: "var(--ink)", color: "var(--paper)" }}>
          <div className="relative h-[200px] flex-none overflow-hidden rounded-[22px] lg:h-[380px] lg:w-[520px] lg:rounded-3xl">
            <Image src={wheelImg} alt="" fill sizes="(min-width: 1024px) 520px, 95vw" className="object-cover" />
          </div>
          <div className="flex flex-1 flex-col justify-between gap-5 px-3.5 pb-3.5 pt-5 lg:p-9">
            <h2 className="text-[26px] font-medium leading-[1.05] tracking-[-0.04em] lg:text-[44px] lg:leading-[1.02] lg:tracking-[-0.05em]">
              Taller propio y services oficiales.<br /><span style={{ color: "var(--ash)" }}>Aunque no nos hayas comprado a nosotros.</span>
            </h2>
            <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center">
              <Link href="/contacto?motivo=taller" className="btn light go">Pedir turno<span className="arrow"><ArrowIcon /></span></Link>
              <span className="text-[14.5px]" style={{ color: "var(--fog)" }}>Lun a vie · 8 a 17 h · {branches[0]?.name}</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
