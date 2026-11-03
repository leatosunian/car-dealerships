// Datos del negocio usados por el sitio público.
// Todo lo que está entre [corchetes] es un placeholder: reemplazalo por el dato real.

export const site = {
  name: "Ribera",
  fullName: "Ribera Automotores",
  monogram: "Rb",
  since: "[1998]",
  legalName: "[Razón social S.A.]",
  cuit: "[30-00000000-0]",
  officialBrands: "[marcas]",
  phone: "[011 0000-0000]",
  email: "[hola@ribera.com.ar]",
  // Número real que ya usaba el sitio anterior para el botón flotante.
  whatsapp: "5493424216075",
  whatsappLabel: "[+54 9 342 421-6075]",
  hours: [
    { d: "Lunes a viernes", h: "9 a 19 h" },
    { d: "Sábados", h: "9 a 14 h" },
    { d: "WhatsApp", h: "Lun a sáb · 8 a 21 h" },
  ],
  // Tasas de referencia de los simuladores (TNA, en %).
  tnaFija: 39,
  tnaUva: 9,
};

export type Branch = {
  name: string;
  kind: string;
  addr: string;
  tel: string;
  mapsUrl: string;
  hours: { d: string; h: string }[];
  services: string[];
};

export const branches: Branch[] = [
  {
    name: "Zona Norte",
    kind: "0km, usados y taller",
    addr: "[Av. del Libertador 0000, Vicente López, Buenos Aires]",
    tel: "[011 0000-0000]",
    mapsUrl: "https://maps.google.com",
    hours: [
      { d: "Lunes a viernes", h: "9 a 19 h" },
      { d: "Sábados", h: "9 a 14 h" },
      { d: "Domingos", h: "Cerrado" },
    ],
    services: ["0km", "Usados", "Taller", "Toma de usados"],
  },
  {
    name: "CABA",
    kind: "Usados seleccionados",
    addr: "[Av. Juan B. Justo 0000, Palermo, CABA]",
    tel: "[011 0000-0001]",
    mapsUrl: "https://maps.google.com",
    hours: [
      { d: "Lunes a viernes", h: "9 a 19 h" },
      { d: "Sábados", h: "10 a 14 h" },
      { d: "Domingos", h: "Cerrado" },
    ],
    services: ["Usados", "Toma de usados", "Financiación"],
  },
  {
    name: "Zona Oeste",
    kind: "0km y toma de usados",
    addr: "[Av. Rivadavia 00000, Morón, Buenos Aires]",
    tel: "[011 0000-0002]",
    mapsUrl: "https://maps.google.com",
    hours: [
      { d: "Lunes a viernes", h: "9 a 18 h" },
      { d: "Sábados", h: "9 a 13 h" },
      { d: "Domingos", h: "Cerrado" },
    ],
    services: ["0km", "Toma de usados", "Financiación"],
  },
];

export const navItems = [
  { href: "/vehicles", label: "Stock" },
  { href: "/cotizar", label: "Vendé tu usado" },
  { href: "/financiacion", label: "Financiación" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

export function waLink(text?: string) {
  const base = `https://wa.me/${site.whatsapp}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export function pesos(n: number) {
  return "$ " + Math.round(n).toLocaleString("es-AR");
}

// Cuota por sistema francés.
export function cuotaFrancesa(monto: number, tna: number, meses: number) {
  const r = tna / 100 / 12;
  return (monto * r) / (1 - Math.pow(1 + r, -meses));
}

export function tnaLabel(tna: number) {
  return String(tna).replace(".", ",") + "%";
}
