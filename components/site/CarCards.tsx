import Image from "next/image";
import Link from "next/link";
import type { PublicCar } from "@/lib/car-format";
import { formatKm } from "@/lib/car-format";
import { ArrowIcon } from "./icons";
import noimage from "@/public/noimage.jpg";

export function statusLabel(car: PublicCar) {
  if (car.status === "RESERVED") return "Reservado";
  if (car.status === "OPORTUNIDAD") return "Oportunidad";
  return car.cond;
}

export function CarPhoto({ car, sizes, priority }: { car: PublicCar; sizes: string; priority?: boolean }) {
  return car.img ? (
    <Image src={car.img} alt={car.name} fill sizes={sizes} priority={priority} className="object-cover" />
  ) : (
    <Image src={noimage} alt="" fill sizes={sizes} className="object-cover" />
  );
}

// Precio con la moneda más chica que el número ("$ 11.500.000", "USD 52.900").
function Price({ label }: { label: string }) {
  const [currency, ...rest] = label.split(" ");
  return (
    <span className="card-price flex items-baseline gap-1 whitespace-nowrap">
      <span className="text-[13px] font-medium" style={{ color: "var(--fog)" }}>{currency}</span>
      <span className="text-[21px] font-semibold leading-none tracking-[-0.035em] lg:text-[23px]">{rest.join(" ")}</span>
    </span>
  );
}

// Flecha que al pasar el mouse por la card se estira y muestra "Ver vehículo".
function CardCta({ inverted }: { inverted?: boolean }) {
  return (
    <span className={`card-cta${inverted ? " inv" : ""}`} aria-hidden="true">
      <span className="card-cta-label">Ver vehículo</span>
      <span className="card-cta-icon"><ArrowIcon /></span>
    </span>
  );
}

// Tarjeta oscura con foto a sangre y datos sobre vidrio (Home, similares).
export function CarTile({ car, className = "" }: { car: PublicCar; className?: string }) {
  return (
    <Link href={`/vehicles/${car.uuid}`} className={`lift relative block overflow-hidden rounded-[28px] lg:rounded-[32px] ${className}`} style={{ background: "var(--ink)", color: "var(--paper)" }}>
      <CarPhoto car={car} sizes="(min-width: 1024px) 33vw, 85vw" />
      <span className="pill-tag absolute left-4 top-4" style={{ height: 34, fontSize: 13, padding: "0 14px" }}>
        <span className="dot" style={{ width: 7, height: 7 }} />{statusLabel(car)}
      </span>
      {/* Sombra inferior para que el vidrio se lea igual sobre fotos claras */}
      <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2" style={{ background: "linear-gradient(to top, rgba(22,22,22,0.55), transparent)" }} />
      <div className="glass absolute inset-x-2.5 bottom-2.5 flex flex-col gap-3.5 rounded-3xl p-[18px] lg:p-5">
        <span className="flex flex-col gap-1">
          <span className="text-[12.5px]" style={{ color: "var(--fog)" }}>{[car.body, car.gearbox].filter(Boolean).join(" · ")}</span>
          <span className="line-clamp-1 text-[17px] font-medium leading-snug tracking-[-0.02em] lg:text-[18px]">{car.name}</span>
        </span>
        <span className="flex flex-wrap gap-1.5">
          {[String(car.year), formatKm(car.km), car.fuel].filter(Boolean).map((t) => (
            <span key={t} className="inline-flex h-7 items-center rounded-full px-3 text-[12.5px] font-medium tabular-nums tracking-[-0.01em]" style={{ background: "rgba(245,245,242,0.1)", color: "var(--silver)" }}>{t}</span>
          ))}
        </span>
        <div className="card-row flex items-center border-t pt-3.5" style={{ borderColor: "rgba(245,245,242,0.12)" }}>
          <Price label={car.priceLabel} />
          <CardCta inverted />
        </div>
      </div>
    </Link>
  );
}

// Tarjeta clara del listado de stock.
export function CarCard({ car }: { car: PublicCar }) {
  return (
    <Link href={`/vehicles/${car.uuid}`} className="lift flex flex-col overflow-hidden rounded-[28px] lg:rounded-[30px]" style={{ background: "var(--panel)" }}>
      <span className="relative m-1.5 block aspect-[10/9] overflow-hidden rounded-[22px] lg:m-2 lg:rounded-3xl" style={{ background: "var(--ink)" }}>
        <CarPhoto car={car} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 95vw" />
        <span className="pill-tag absolute left-3 top-3">
          <span className="dot" style={{ width: 6, height: 6 }} />{statusLabel(car)}
        </span>
      </span>
      <span className="flex flex-1 flex-col gap-3 px-[18px] pb-[18px] pt-2.5 lg:px-[22px] lg:pb-[22px] lg:pt-3">
        <span className="flex flex-col gap-1">
          <span className="mut text-[12.5px] lg:text-[13px]">{car.body} · {car.brand}</span>
          <span className="line-clamp-2 text-[18px] font-medium tracking-[-0.02em]">{car.name}</span>
        </span>
        <span className="flex flex-wrap gap-1.5">
          {[String(car.year), formatKm(car.km), car.fuel, car.gearbox].filter(Boolean).map((t) => (
            <span key={t} className="inline-flex h-7 items-center rounded-full px-3 text-[12.5px] font-medium tabular-nums tracking-[-0.01em]" style={{ background: "var(--mist)" }}>{t}</span>
          ))}
        </span>
        <span className="card-row mt-auto flex items-center border-t pt-3.5" style={{ borderColor: "var(--line)" }}>
          <span className="card-price whitespace-nowrap text-[22px] font-semibold tracking-[-0.035em] lg:text-[23px]">{car.priceLabel}</span>
          <CardCta />
        </span>
      </span>
    </Link>
  );
}
