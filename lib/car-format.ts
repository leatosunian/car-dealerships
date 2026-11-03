// Tipos y formateo de autos que pueden usarse también en componentes de cliente (sin mongoose).

export type PublicCar = {
  uuid: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  km: number;
  price: number;
  currency: "ARS" | "USD";
  priceLabel: string;
  type: string;
  body: string;
  cond: "0 km" | "Usado";
  gearbox: string;
  fuel: string;
  doors: string;
  motor: string;
  drive: string;
  status: string;
  img: string;
  createdAt: number;
};

export function formatPrice(price: number, currency: string) {
  const n = Math.round(price).toLocaleString("es-AR");
  return currency === "USD" ? `USD ${n}` : `$ ${n}`;
}

export function formatKm(km: number) {
  return km === 0 ? "0 km" : `${km.toLocaleString("es-AR")} km`;
}
