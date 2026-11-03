"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { waLink } from "@/lib/site";
import { WaIcon } from "./icons";

// Acción principal de cada página en mobile.
function actionFor(pathname: string): { label: string; href: string } | null {
  if (pathname === "/") return { label: "Ver el stock", href: "/vehicles" };
  if (pathname === "/vehicles") return { label: "Agendar una visita", href: "/contacto" };
  if (pathname.startsWith("/vehicles/")) return { label: "Consultar este auto", href: "" };
  if (pathname === "/cotizar") return { label: "Hablar con un tasador", href: "/contacto?motivo=vender" };
  if (pathname === "/financiacion") return { label: "Pedir preaprobación", href: "/contacto?motivo=financiacion" };
  if (pathname === "/nosotros") return { label: "Agendar una visita", href: "/contacto" };
  if (pathname === "/contacto") return { label: "Ver el stock", href: "/vehicles" };
  return null;
}

export default function MobileBar() {
  const pathname = usePathname() || "/";

  const action = actionFor(pathname);
  if (!action) return null;
  const consult = action.href === "";

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 px-2.5 pb-3 lg:hidden">
      <div className="flex gap-1.5 rounded-full p-1.5" style={{ background: "rgba(22,22,22,0.86)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", boxShadow: "0 14px 40px rgba(0,0,0,0.22)" }}>
        <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn dsoft" style={{ height: 52, padding: "0 18px" }} aria-label="Escribinos por WhatsApp">
          <WaIcon />WhatsApp
        </a>
        {consult ? (
          <a
            href={waLink("Hola, me interesa este auto.")}
            onClick={(e) => { e.currentTarget.href = waLink(`Hola, me interesa este auto: ${window.location.href}`); }}
            target="_blank"
            rel="noopener noreferrer"
            className="btn light flex-1"
            style={{ height: 52 }}
          >
            {action.label}
          </a>
        ) : (
          <Link href={action.href} className="btn light flex-1" style={{ height: 52 }}>
            {action.label}
          </Link>
        )}
      </div>
    </div>
  );
}
