import connectDB from "@/lib/db";
import CarModel from "@/app/models/car";
import CarImageModel from "@/app/models/carimage";
import CarConfortSecurityModel from "@/app/models/confortsecurity";

import { formatKm, formatPrice, type PublicCar } from "@/lib/car-format";

export { formatKm, formatPrice };
export type { PublicCar };

export type CarDetail = PublicCar & {
  description: string;
  gallery: string[];
  equipment: { key: string; value: string }[];
  review: { label: string; value: string }[];
};

const BODY: Record<string, string> = {
  SUV: "SUV",
  PICKUP: "Pickup",
  SEDAN: "Sedán",
  SEDAN5P: "Sedán",
  HATCHBACK: "Hatchback",
  COUPE: "Coupé",
  CONVERTIBLE: "Convertible",
  CABRIO: "Convertible",
  WAGON: "Rural",
  VAN: "Van",
  MINIVAN: "Monovolumen",
  UTILITARY: "Utilitario",
  TRUCK: "Camión",
};

const FUEL: Record<string, string> = { NAFTA: "Nafta", DIESEL: "Diésel", GNC: "GNC" };
const GEARBOX: Record<string, string> = { AUTOMATIC: "Automática", MANUAL: "Manual" };

function toPublic(doc: any): PublicCar {
  const type = String(doc.type || "");
  return {
    uuid: doc.uuid,
    name: String(doc.name || `${doc.brand} ${doc.modelName}`).trim(),
    brand: doc.brand,
    model: String(doc.modelName || "").trim(),
    year: doc.year,
    km: doc.kilometers ?? 0,
    price: doc.price,
    currency: doc.currency === "USD" ? "USD" : "ARS",
    priceLabel: formatPrice(doc.price, doc.currency),
    type,
    body: BODY[type] || "Otro",
    cond: doc.kilometers === 0 ? "0 km" : "Usado",
    gearbox: GEARBOX[doc.gearbox] || doc.gearbox || "",
    fuel: FUEL[doc.gas] || doc.gas || "",
    doors: doc.doors || "",
    motor: doc.motor || "",
    drive: doc.drive || "",
    status: doc.status || "AVAILABLE",
    img: doc.imagePath || "",
    createdAt: doc.createdAt ? new Date(doc.createdAt).getTime() : 0,
  };
}

const visible = { show: { $ne: false }, status: { $ne: "SOLD" } };

export async function getPublicCars(limit?: number): Promise<PublicCar[]> {
  try {
    await connectDB();
    const query = CarModel.find(visible).sort({ createdAt: -1 }).lean();
    if (limit) query.limit(limit);
    const docs = await query;
    return docs.map(toPublic);
  } catch (error) {
    console.error("ERROR_GET_PUBLIC_CARS", error);
    return [];
  }
}

export async function getCarDetail(uuid: string): Promise<CarDetail | null> {
  try {
    await connectDB();
    const doc: any = await CarModel.findOne({ uuid, ...visible }).lean();
    if (!doc) return null;
    const [images, equipment] = await Promise.all([
      CarImageModel.find({ carID: uuid }).sort({ createdAt: 1 }).lean(),
      CarConfortSecurityModel.find({ carID: uuid }).sort({ createdAt: 1 }).lean(),
    ]);
    const car = toPublic(doc);
    const gallery = [car.img, ...images.map((i: any) => i.path)].filter(Boolean);

    const review: { label: string; value: string }[] = [];
    const add = (label: string, value: unknown, suffix = "") => {
      if (value !== null && value !== undefined && value !== "") review.push({ label, value: `${value}${suffix}` });
    };
    add("Estado general", doc.generalCondition);
    add("Último service", doc.lastestService);
    if (doc.hasVTV) add("VTV", doc.VTVExpDate ? `Vigente hasta ${doc.VTVExpDate}` : "Vigente");
    add("Dueños anteriores", doc.ownerNumber);
    add("Distribución (cambio a los)", doc.timingBelt ? doc.timingBelt.toLocaleString("es-AR") : null, doc.timingBelt ? " km" : "");
    add("Neumáticos delanteros", doc.tireConditionFront, doc.tireConditionFront != null ? "% de vida útil" : "");
    add("Neumáticos traseros", doc.tireConditionBack, doc.tireConditionBack != null ? "% de vida útil" : "");
    add("Batería", doc.battery);
    add("Pintura", doc.paintDetails);

    return {
      ...car,
      description: String(doc.description || "").trim(),
      gallery: Array.from(new Set(gallery)),
      equipment: equipment.map((e: any) => ({ key: e.key, value: e.value })),
      review,
    };
  } catch (error) {
    console.error("ERROR_GET_CAR_DETAIL", error);
    return null;
  }
}
