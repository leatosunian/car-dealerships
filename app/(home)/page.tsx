import Image from "next/image";
import Link from "next/link";
import { getPublicCars, formatKm } from "@/lib/cars";
import { branches, site } from "@/lib/site";
import { ArrowIcon, CheckIcon, SwapIcon, TagIcon } from "@/components/site/icons";
import { CarPhoto } from "@/components/site/CarCards";
import { FinanceTeaser, HomeArrivals, HomeQuote, HomeSearch } from "@/components/site/HomeClient";
import heroImg from "@/public/images/hero-tiguan.jpg";
import buyImg from "@/public/images/c6.jpg";
import shifterImg from "@/public/images/i3.jpg";
import interiorImg from "@/public/images/i1.jpg";

export const dynamic = "force-dynamic";

const promises = [
  { t: "Revisión de [150] puntos", d: "Mecánica, electrónica, chapa y documentación. Te damos el informe completo, no un resumen." },
  { t: "Garantía escrita de [6] meses", d: "Motor y caja cubiertos en cualquier usado que compres, sin letra chica." },
  { t: "Transferencia y 08 incluidos", d: "Nos ocupamos del registro, la verificación policial y el formulario 08." },
  { t: "El precio publicado es el que pagás", d: "Gastos de patentamiento y flete detallados antes de reservar." },
];

const H2 = "text-[38px] font-semibold leading-none tracking-[-0.05em] lg:text-[60px]";

export default async function Home() {
  const cars = await getPublicCars();
  const featured = cars.find((c) => c.status === "OPORTUNIDAD") ?? cars[0];

  // Carrocerías con más unidades, con la foto del último auto de cada una.
  const byBody = new Map<string, { count: number; car: (typeof cars)[number] }>();
  for (const car of cars) {
    const entry = byBody.get(car.body);
    if (entry) entry.count++;
    else byBody.set(car.body, { count: 1, car });
  }
  const bodies = Array.from(byBody.entries()).sort((a, b) => b[1].count - a[1].count).slice(0, 4);

  const brandCounts = new Map<string, number>();
  for (const car of cars) brandCounts.set(car.brand, (brandCounts.get(car.brand) ?? 0) + 1);
  const brands = Array.from(brandCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 8);

  return (
    <main>
      {/* Hero */}
      <section className="sheet mx-2.5 mt-2.5 lg:mx-8 lg:mt-6">
        <div className="relative flex flex-col lg:block lg:h-[700px]">
          <span aria-hidden="true" className="watermark left-4 top-3 text-[96px] lg:left-[30px] lg:top-0 lg:text-[236px]">{site.name}</span>
          {/* Foto a la derecha, sin nada encima del auto; los bordes se funden con la hoja */}
          <div className="hero-photo relative mt-[60px] h-[240px] sm:h-[340px] lg:absolute lg:bottom-[64px] lg:left-[33%] lg:right-0 lg:top-0 lg:mt-0 lg:h-auto">
            <Image src={heroImg} alt="Volkswagen Tiguan Allspace gris con las luces encendidas" fill priority sizes="(min-width: 1024px) 67vw, 100vw" className="object-cover" style={{ objectPosition: "48% 55%" }} />
          </div>
          <div className="relative flex flex-col gap-5 px-6 pb-6 lg:absolute lg:bottom-[104px] lg:left-9 lg:w-[520px] lg:gap-6 lg:p-0">
            <h1 className="text-[42px] font-medium leading-[0.98] tracking-[-0.05em] lg:text-[64px]">El próximo auto, sin vueltas.</h1>
            <p className="max-w-[460px] text-[15.5px] font-light leading-relaxed lg:text-[17px]" style={{ color: "var(--silver)" }}>
              0km de todas las marcas, usados revisados uno por uno y tu auto tomado como parte de pago. Todo en la misma visita.
            </p>
            <div className="mt-1 flex flex-col gap-2.5 sm:flex-row">
              <Link href="/vehicles" className="btn light go">Ver el stock<span className="arrow"><ArrowIcon /></span></Link>
              <Link href="/cotizar" className="btn dline">Cotizar mi usado</Link>
            </div>
          </div>
          {featured && (
            <Link
              href={`/vehicles/${featured.uuid}`}
              className="lift relative m-2 mt-0 flex items-center gap-4 rounded-[26px] p-3 lg:absolute lg:right-9 lg:top-6 lg:m-0 lg:gap-5 lg:p-3 lg:pr-5"
              style={{ background: "rgba(245,245,242,0.94)", color: "var(--ink)" }}
            >
              <span className="relative h-[72px] w-[96px] flex-none overflow-hidden rounded-[18px]" style={{ background: "var(--ink)" }}>
                <CarPhoto car={featured} sizes="96px" />
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="mut text-[13px]">{featured.status === "OPORTUNIDAD" ? "Oportunidad de la semana" : "Recién llegado"}</span>
                <span className="line-clamp-1 text-[16px] font-semibold tracking-[-0.02em] lg:max-w-[240px] lg:text-[18px]">{featured.name}</span>
                <span className="mono mut text-[12px]">{featured.year} · {formatKm(featured.km)}</span>
              </span>
              <span className="hidden whitespace-nowrap text-[26px] font-semibold tracking-[-0.04em] lg:block">{featured.priceLabel}</span>
              <span className="arrow"><ArrowIcon /></span>
            </Link>
          )}
        </div>
      </section>

      {/* Buscador */}
      <section className="relative z-[6] mx-2.5 mt-2.5 lg:mx-24 lg:-mt-[38px]">
        <HomeSearch />
      </section>

      {/* Comprá · Vendé · Cambiá */}
      <section className="px-2.5 pt-16 lg:px-16 lg:pt-28">
        <div className="mb-7 flex flex-col gap-4 px-2.5 lg:mb-9 lg:flex-row lg:items-end lg:justify-between lg:gap-16 lg:px-0">
          <h2 className={H2}>Comprá, vendé o cambiá.</h2>
          <p className="mut max-w-[380px] text-[15px] leading-relaxed lg:text-[16.5px]">Las tres cosas se resuelven en una sola visita, con un asesor que te acompaña de punta a punta.</p>
        </div>
        <div className="grid gap-2.5 lg:grid-cols-[1.25fr_1fr_1fr] lg:gap-5">
          <Link href="/vehicles" className="lift relative block h-[340px] overflow-hidden rounded-[28px] lg:h-[400px] lg:rounded-[32px]" style={{ background: "var(--ink)", color: "var(--paper)" }}>
            <Image src={buyImg} alt="" fill sizes="(min-width: 1024px) 40vw, 95vw" className="object-cover" />
            <div className="glass absolute inset-x-3 bottom-3 flex items-end justify-between gap-5 rounded-3xl p-6">
              <span className="flex flex-col gap-2">
                <span className="text-[28px] font-semibold tracking-[-0.04em] lg:text-[30px]">Comprá</span>
                <span className="text-[15px] leading-normal" style={{ color: "var(--silver)" }}>0km de concesionario oficial y usados con garantía escrita.</span>
              </span>
              <span className="arrow inv" style={{ width: 48, height: 48 }}><ArrowIcon /></span>
            </div>
          </Link>
          <Link href="/cotizar" className="lift flex h-[300px] flex-col justify-between rounded-[28px] p-7 lg:h-[400px] lg:rounded-[32px] lg:p-[30px]" style={{ background: "var(--panel)" }}>
            <span className="flex h-16 w-16 items-center justify-center rounded-[22px]" style={{ background: "var(--mist)" }}><TagIcon /></span>
            <span className="flex flex-col gap-2.5">
              <span className="text-[28px] font-semibold tracking-[-0.04em] lg:text-[30px]">Vendé</span>
              <span className="mut text-[15px] leading-normal">Revisamos tu auto en 40 minutos y te damos una oferta firme en el día.</span>
            </span>
            <span className="row-link text-[15px] font-medium">Cotizar mi usado<span className="arrow"><ArrowIcon /></span></span>
          </Link>
          <Link href="/financiacion" className="lift flex h-[300px] flex-col justify-between rounded-[28px] p-7 lg:h-[400px] lg:rounded-[32px] lg:p-[30px]" style={{ background: "var(--stone)" }}>
            <span className="flex h-16 w-16 items-center justify-center rounded-[22px]" style={{ background: "var(--mist)" }}><SwapIcon /></span>
            <span className="flex flex-col gap-2.5">
              <span className="text-[28px] font-semibold tracking-[-0.04em] lg:text-[30px]">Cambiá</span>
              <span className="text-[15px] leading-normal" style={{ color: "var(--ink-5)" }}>Entregás tu auto como parte de pago y la diferencia la financiás en cuotas.</span>
            </span>
            <span className="row-link text-[15px] font-medium">Ver cómo funciona<span className="arrow"><ArrowIcon /></span></span>
          </Link>
        </div>
      </section>

      {/* Por tipo */}
      {bodies.length > 0 && (
        <section className="px-2.5 pt-16 lg:px-16 lg:pt-28">
          <div className="mb-7 flex items-end justify-between gap-6 px-2.5 lg:mb-9 lg:px-0">
            <h2 className={H2}>¿Qué estás buscando?</h2>
            <Link href="/vehicles" className="btn line go hidden lg:inline-flex">Todo el stock<span className="arrow"><ArrowIcon /></span></Link>
          </div>
          <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4 lg:gap-5">
            {bodies.map(([body, { count, car }]) => (
              <Link key={body} href={`/vehicles?body=${encodeURIComponent(body)}`} className="lift relative block h-[220px] overflow-hidden rounded-[26px] lg:h-[380px] lg:rounded-[32px]" style={{ background: "var(--ink)", color: "var(--paper)" }}>
                <CarPhoto car={car} sizes="(min-width: 1024px) 25vw, 50vw" />
                <div className="glass absolute inset-x-2 bottom-2 flex items-center justify-between rounded-[20px] py-3 pl-4 pr-2 lg:inset-x-2.5 lg:bottom-2.5 lg:rounded-[22px] lg:py-4 lg:pl-5 lg:pr-2.5">
                  <span className="flex flex-col gap-1">
                    <span className="text-[18px] font-semibold tracking-[-0.03em] lg:text-[22px]">{body}</span>
                    <span className="mono text-[12px] lg:text-[12.5px]" style={{ color: "var(--silver)" }}>{count} {count === 1 ? "unidad" : "unidades"}</span>
                  </span>
                  <span className="arrow inv hidden lg:inline-flex"><ArrowIcon /></span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Recién llegados */}
      <section className="px-2.5 pt-16 lg:px-16 lg:pt-28">
        <HomeArrivals cars={cars.slice(0, 9)} />
      </section>

      {/* Usado */}
      <section className="px-2.5 pt-16 lg:px-16 lg:pt-28">
        <div className="panel flex flex-col gap-4 p-2 lg:flex-row lg:p-4">
          <div className="flex flex-1 flex-col gap-7 px-4 py-6 lg:px-9 lg:py-10">
            <h2 className="text-[36px] font-semibold leading-none tracking-[-0.05em] lg:text-[52px]">
              Tu usado vale.<br /><span style={{ color: "var(--ash)" }}>Te decimos cuánto, hoy.</span>
            </h2>
            <p className="mut max-w-[520px] text-[15px] leading-relaxed lg:text-[16.5px]">
              Cargá tres datos y un tasador te responde por WhatsApp. La oferta firme llega después de una revisión de 40 minutos en cualquiera de nuestras sucursales.
            </p>
            <HomeQuote />
            <ol className="mt-2 grid grid-cols-3 gap-3 border-t pt-6 lg:gap-5" style={{ borderColor: "var(--stone)" }}>
              {["Cargás los datos", "Lo revisamos en 40 min", "Oferta firme en el día"].map((t, i) => (
                <li key={t} className="flex flex-col gap-1.5">
                  <span className="mono mut text-[12.5px]">Paso {i + 1}</span>
                  <span className="text-[14px] font-medium lg:text-[15.5px]">{t}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="relative h-[240px] overflow-hidden rounded-[22px] lg:h-auto lg:w-[560px] lg:rounded-[26px]" style={{ background: "var(--ink)" }}>
            <Image src={shifterImg} alt="" fill sizes="(min-width: 1024px) 560px, 95vw" className="object-cover" />
            <span className="glass absolute bottom-4 left-4 flex flex-col gap-1 rounded-[20px] px-[18px] py-3.5">
              <span className="text-[13px]" style={{ color: "var(--silver)" }}>Tomamos usados de hasta</span>
              <span className="text-[24px] font-semibold tracking-[-0.03em]">[15] años</span>
            </span>
          </div>
        </div>
      </section>

      {/* Financiación */}
      <section className="px-2.5 pt-2.5 lg:px-16 lg:pt-6">
        <div className="relative flex flex-col gap-8 overflow-hidden rounded-[28px] p-2 pt-8 lg:flex-row lg:gap-14 lg:rounded-[32px] lg:p-14" style={{ background: "var(--ink)", color: "var(--paper)" }}>
          <div className="flex flex-1 flex-col justify-between gap-6 px-4 lg:px-0">
            <div className="flex flex-col gap-[22px]">
              <h2 className="text-[34px] font-medium leading-none tracking-[-0.05em] lg:text-[52px]">
                Cuotas fijas en pesos.<br /><span style={{ color: "var(--ash)" }}>Ves el CFT antes de firmar.</span>
              </h2>
              <p className="max-w-[460px] text-[15px] leading-relaxed lg:text-[16.5px]" style={{ color: "var(--fog)" }}>
                Trabajamos con [4] bancos y financieras para conseguirte la mejor tasa. Preaprobación en 24 horas, sin cuenta bancaria obligatoria.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Tasa fija", "UVA", "0km y usados", "Hasta 60 meses"].map((t) => <span key={t} className="dchip">{t}</span>)}
            </div>
          </div>
          <FinanceTeaser />
        </div>
      </section>

      {/* Garantía */}
      <section className="flex flex-col gap-2.5 px-2.5 pt-16 lg:flex-row lg:gap-5 lg:px-16 lg:pt-28">
        <div className="relative h-[280px] flex-none overflow-hidden rounded-[28px] lg:h-[620px] lg:w-[600px] lg:rounded-[32px]" style={{ background: "var(--ink)" }}>
          <Image src={interiorImg} alt="" fill sizes="(min-width: 1024px) 600px, 95vw" className="object-cover" />
        </div>
        <div className="panel flex flex-1 flex-col justify-between gap-6 p-6 lg:p-12">
          <h2 className="text-[34px] font-semibold leading-[1.02] tracking-[-0.05em] lg:text-[48px]">
            Un usado de {site.name}<br /><span style={{ color: "var(--ash)" }}>se compra tranquilo.</span>
          </h2>
          <ul className="flex flex-col">
            {promises.map((g) => (
              <li key={g.t} className="flex items-start gap-[18px] border-t py-[22px]" style={{ borderColor: "var(--stone)" }}>
                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full" style={{ background: "var(--ink)", color: "var(--paper)" }}><CheckIcon /></span>
                <span className="flex flex-col gap-1">
                  <span className="text-[17px] font-medium tracking-[-0.02em] lg:text-[18px]">{g.t}</span>
                  <span className="mut text-[14.5px] leading-normal lg:text-[15px]">{g.d}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Marcas */}
      {brands.length > 0 && (
        <section className="px-2.5 pt-2.5 lg:px-16 lg:pt-6">
          <div className="panel flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:gap-10 lg:px-10 lg:py-9">
            <p className="text-[16px] leading-normal lg:w-[260px] lg:flex-none">0km oficial de {site.officialBrands}. Usados de todas.</p>
            <div className="flex flex-1 flex-wrap gap-2.5">
              {brands.map(([name, count]) => (
                <Link key={name} href={`/vehicles?brand=${encodeURIComponent(name)}`} className="pill-link flex h-14 items-center gap-2.5 rounded-full border bg-white px-6 text-[16px] font-semibold tracking-[-0.03em] lg:h-16 lg:px-7 lg:text-[17px]" style={{ borderColor: "var(--line)" }}>
                  {name}<span className="mono mut text-[12px] font-normal">{count}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sucursales */}
      <section className="px-2.5 pt-16 lg:px-16 lg:pt-28">
        <div className="mb-7 flex items-end justify-between gap-6 px-2.5 lg:mb-9 lg:px-0">
          <h2 className={H2}>Vení a verlos.</h2>
          <Link href="/nosotros#sucursales" className="btn line go hidden lg:inline-flex">Ver sucursales<span className="arrow"><ArrowIcon /></span></Link>
        </div>
        <div className="grid gap-2.5 lg:grid-cols-3 lg:gap-5">
          {branches.map((b) => (
            <Link key={b.name} href="/nosotros#sucursales" className="panel lift flex flex-col gap-7 p-6 lg:p-[30px]">
              <span className="text-[24px] font-semibold tracking-[-0.04em] lg:text-[26px]">{b.name}</span>
              <span className="flex flex-col gap-1.5 text-[15px] leading-normal">
                <span>{b.addr}</span>
                <span className="mut">{b.kind}</span>
              </span>
              <span className="row-link border-t pt-[18px]" style={{ borderColor: "var(--stone)" }}>
                <span className="mono text-[13px]">{b.hours[0].d} · {b.hours[0].h}</span>
                <span className="arrow"><ArrowIcon /></span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
