import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatKm, getCarDetail, getPublicCars } from "@/lib/cars";
import { waLink } from "@/lib/site";
import { ArrowIcon, WaIcon } from "@/components/site/icons";
import { CarTile, statusLabel } from "@/components/site/CarCards";
import { DetailTabs, FinanceBox, Gallery } from "@/components/site/VehicleClient";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ uuid: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const car = await getCarDetail((await params).uuid);
  if (!car) return { title: "Vehículo no encontrado" };
  return {
    title: `${car.name} ${car.year}`,
    description: `${car.name} ${car.year}, ${formatKm(car.km)}, ${car.priceLabel}. Aceptamos tu usado y financiamos.`,
    openGraph: car.img ? { images: [car.img] } : undefined,
  };
}

export default async function VehiclePage({ params }: Props) {
  const { uuid } = await params;
  const [car, all] = await Promise.all([getCarDetail(uuid), getPublicCars()]);
  if (!car) notFound();

  const others = all.filter((c) => c.uuid !== car.uuid);
  const similar = [...others.filter((c) => c.body === car.body), ...others.filter((c) => c.body !== car.body)].slice(0, 3);

  const specs = [
    { k: "Año", v: String(car.year) },
    { k: "Kilómetros", v: car.km.toLocaleString("es-AR") },
    { k: "Motor", v: car.motor },
    { k: "Transmisión", v: car.gearbox },
    { k: "Combustible", v: car.fuel },
    { k: "Carrocería", v: car.body },
    { k: "Puertas", v: car.doors.replace("P", "") },
    { k: "Tracción", v: car.drive },
  ].filter((s) => s.v);

  const tabs = [];
  if (car.description) tabs.push({ label: "Descripción", intro: "Lo que hay que saber de esta unidad.", text: car.description });
  if (car.equipment.length) {
    tabs.push({ label: "Equipamiento", intro: "Confort y seguridad que trae esta unidad.", items: car.equipment.map((e) => ({ t: e.key, s: e.value })) });
  }
  tabs.push(
    car.review.length
      ? { label: "Informe de revisión", intro: "Lo que revisó nuestro taller antes de publicarla. Te entregamos el informe completo.", items: car.review.map((r) => ({ t: r.label, s: r.value })) }
      : { label: "Informe de revisión", intro: "Cada usado pasa por nuestra revisión de [150] puntos antes de entregarse. Pedinos el informe de esta unidad por WhatsApp." }
  );
  tabs.push({
    label: "Documentación",
    intro: "Antes de entregar el auto verificamos todo esto. La transferencia y el formulario 08 corren por nuestra cuenta.",
    items: [
      { t: "Título y cédula", s: "Verificado" },
      { t: "Verificación policial", s: "La gestionamos" },
      { t: "Libre deuda de patentes", s: "Verificado" },
      { t: "Libre deuda de infracciones", s: "Verificado" },
      { t: "Informe de dominio", s: "Sin prendas" },
      { t: "Formulario 08", s: "Lo gestionamos" },
    ],
  });

  const waText = `Hola, me interesa el ${car.name} ${car.year} (${car.priceLabel}).`;

  return (
    <main>
      <section className="sheet mx-2.5 mt-2.5 lg:mx-8 lg:mt-6">
        <nav aria-label="Ruta" className="flex flex-wrap gap-2.5 px-5 pt-5 text-[14px] lg:px-9 lg:pt-2" style={{ color: "var(--ash)" }}>
          <Link href="/vehicles" style={{ color: "var(--silver)" }}>Stock</Link>
          <span aria-hidden="true">/</span>
          <Link href={`/vehicles?body=${encodeURIComponent(car.body)}`} style={{ color: "var(--silver)" }}>{car.body}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="line-clamp-1" style={{ color: "var(--paper)" }}>{car.name}</span>
        </nav>
        <div className="flex flex-col gap-2.5 p-2 pt-4 lg:flex-row lg:gap-7 lg:px-7 lg:pb-7 lg:pt-6">
          <div className="min-w-0 flex-1">
            <Gallery photos={car.gallery} name={car.name} />
          </div>
          <div className="flex flex-col gap-2.5 lg:w-[440px] lg:flex-none">
            <div className="flex flex-col gap-[22px] rounded-[26px] p-6 lg:rounded-[30px] lg:p-[30px]" style={{ background: "var(--ink-2)" }}>
              <span className="flex flex-wrap gap-1.5">
                <span className="inline-flex h-8 items-center gap-2 rounded-full px-3 text-[13px]" style={{ background: "var(--ink-4)" }}>
                  <span className="dot" style={{ width: 7, height: 7 }} />{car.status === "RESERVED" ? "Reservado" : "Disponible"}
                </span>
                <span className="inline-flex h-8 items-center rounded-full px-3 text-[13px]" style={{ background: "var(--ink-4)" }}>{car.cond === "0 km" ? "0 km" : "Usado revisado"}</span>
                {car.status === "OPORTUNIDAD" && <span className="inline-flex h-8 items-center rounded-full px-3 text-[13px]" style={{ background: "var(--ink-4)" }}>{statusLabel(car)}</span>}
              </span>
              <div className="flex flex-col gap-2.5">
                <h1 className="text-[34px] leading-none tracking-[-0.05em] lg:text-[44px]">{car.name}</h1>
                <span className="mono text-[13.5px]" style={{ color: "var(--fog)" }}>
                  {[String(car.year), formatKm(car.km), car.gearbox, car.fuel].filter(Boolean).join(" · ")}
                </span>
              </div>
              <div className="flex flex-col gap-1.5 border-y py-[22px]" style={{ borderColor: "var(--ink-4)" }}>
                <span className="text-[44px] font-semibold leading-none tracking-[-0.05em] lg:text-[56px]">{car.priceLabel}</span>
                <span className="text-[14.5px]" style={{ color: "var(--fog)" }}>Aceptamos tu usado como parte de pago · Financiación disponible</span>
              </div>
              <div className="flex flex-col gap-2">
                <a href={waLink(waText)} target="_blank" rel="noopener noreferrer" className="btn light" style={{ height: 58 }}><WaIcon />Consultar por WhatsApp</a>
                <a href={waLink(`${waText} Quiero agendar una prueba de manejo.`)} target="_blank" rel="noopener noreferrer" className="btn dline" style={{ height: 58 }}>Agendar prueba de manejo</a>
                <Link href="/cotizar" className="btn dsoft" style={{ height: 58 }}>Entregar mi usado en parte de pago</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ficha técnica */}
      <section className="px-2.5 pt-2.5 lg:px-16 lg:pt-8">
        <div className="panel flex flex-col gap-6 p-5 lg:gap-7 lg:p-10">
          <h2 className="text-[26px] tracking-[-0.04em] lg:text-[32px]">Ficha técnica</h2>
          <dl className="grid grid-cols-2 gap-2 lg:grid-cols-4 lg:gap-2.5">
            {specs.map((s) => (
              <div key={s.k} className="flex flex-col gap-2 rounded-[22px] bg-white px-[18px] py-4 lg:px-[22px] lg:py-5">
                <dt className="mut text-[13px] lg:text-[13.5px]">{s.k}</dt>
                <dd className="mono text-[15px] lg:text-[17px]">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Tabs + financiación */}
      <section className="flex flex-col gap-2.5 px-2.5 pt-2.5 lg:flex-row lg:items-start lg:gap-6 lg:px-16 lg:pt-6">
        <DetailTabs tabs={tabs} />
        <FinanceBox priceArs={car.currency === "ARS" ? car.price : null} />
      </section>

      {/* Similares */}
      {similar.length > 0 && (
        <section className="px-2.5 pt-16 lg:px-16 lg:pt-24">
          <div className="mb-7 flex items-end justify-between gap-6 px-2.5 lg:mb-8 lg:px-0">
            <h2 className="text-[34px] leading-none tracking-[-0.05em] lg:text-[52px]">También te puede gustar</h2>
            <Link href="/vehicles" className="btn line go hidden lg:inline-flex">Ver el stock<span className="arrow"><ArrowIcon /></span></Link>
          </div>
          <div className="grid gap-2.5 lg:grid-cols-3 lg:gap-5">
            {similar.map((c) => <CarTile key={c.uuid} car={c} className="h-[470px] lg:h-[480px]" />)}
          </div>
        </section>
      )}
    </main>
  );
}
