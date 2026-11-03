"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { branches, site } from "@/lib/site";
import { ArrowIcon, CheckIcon } from "./icons";
import Select from "./Select";

const MOTIVOS = [
  { id: "comprar", label: "Comprar un auto", hint: "Contanos qué modelo te interesa o qué estás buscando." },
  { id: "vender", label: "Vender mi usado", hint: "Marca, modelo, año y kilómetros de tu auto." },
  { id: "financiacion", label: "Financiación", hint: "Contanos qué auto querés y cuánto pensás poner de anticipo." },
  { id: "taller", label: "Taller y postventa", hint: "Modelo, patente y qué servicio necesitás." },
  { id: "otro", label: "Otro", hint: "Escribinos lo que necesites." },
];

export default function ContactForm() {
  const params = useSearchParams();
  const initial = Math.max(0, MOTIVOS.findIndex((m) => m.id === params.get("motivo")));
  const [motivo, setMotivo] = useState(initial);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [branch, setBranch] = useState("La más cercana");
  const [message, setMessage] = useState("");
  const [touched, setTouched] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const bad = { name: !name.trim(), phone: phone.replace(/\D/g, "").length < 8, message: !message.trim() };

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (bad.name || bad.phone || bad.message) return;
    setSending(true);
    setError("");
    const [first, ...rest] = name.trim().split(/\s+/);
    // Se guarda como consulta de la web: aparece en el panel junto a las cotizaciones.
    const info = [`[Contacto · ${MOTIVOS[motivo].label}]`, message.trim(), `Sucursal: ${branch}`, email ? `Email: ${email}` : ""].filter(Boolean).join(" · ");
    try {
      const res = await fetch("/api/leads/page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: first, surname: rest.join(" ") || "-", phone: phone.trim(), vehicleInfo: info, vehicleYear: "-", vehicleKm: "-" }),
      });
      const data = await res.json();
      if (!res.ok || data.msg !== "QUESTION_CREATED") throw new Error(data.msg);
      setSent(true);
    } catch {
      setError("No pudimos enviar el mensaje. Probá de nuevo o escribinos por WhatsApp.");
    } finally {
      setSending(false);
    }
  }

  function reset() {
    setMessage("");
    setTouched(false);
    setSent(false);
  }

  if (sent) {
    return (
      <div className="flex flex-col items-start gap-[18px] py-6">
        <span className="flex h-16 w-16 items-center justify-center rounded-full" style={{ background: "var(--ink)", color: "var(--paper)" }}><CheckIcon size={28} /></span>
        <h2 className="text-[32px] tracking-[-0.05em] lg:text-[40px]">Mensaje enviado.</h2>
        <p className="mut max-w-[520px] text-[16px] leading-relaxed lg:text-[17px]">Te escribimos por WhatsApp en el día hábil. Si es urgente, llamanos al {site.phone}.</p>
        <div className="flex flex-wrap gap-2.5">
          <Link href="/vehicles" className="btn go">Mirar el stock<span className="arrow"><ArrowIcon /></span></Link>
          <button type="button" className="btn line" onClick={reset}>Enviar otro</button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={send} noValidate className="flex flex-col gap-7">
      <h2 className="text-[26px] tracking-[-0.04em] lg:text-[32px]">Escribinos</h2>
      <fieldset>
        <legend className="mb-3 text-[14px]">¿Sobre qué querés hablar?</legend>
        <div role="radiogroup" className="flex flex-wrap gap-2">
          {MOTIVOS.map((m, i) => (
            <button key={m.id} type="button" role="radio" aria-checked={motivo === i} onClick={() => setMotivo(i)} className={`chip${motivo === i ? " on" : ""}`} style={{ height: 48, padding: "0 20px" }}>
              {m.label}
            </button>
          ))}
        </div>
      </fieldset>
      <div className="grid gap-[18px] sm:grid-cols-2">
        <label className="field"><span>Nombre y apellido</span>
          <input className="input" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={touched && bad.name} />
        </label>
        <label className="field"><span>WhatsApp</span>
          <input className="input" type="tel" placeholder="11 0000 0000" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} aria-invalid={touched && bad.phone} />
        </label>
        <label className="field"><span>Email (opcional)</span>
          <input className="input" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="field"><span>Sucursal</span>
          <Select value={branch} onChange={setBranch} options={["La más cercana", ...branches.map((b) => b.name)]} />
        </label>
        <label className="field sm:col-span-2"><span>Mensaje</span>
          <textarea className="input" placeholder={MOTIVOS[motivo].hint} value={message} onChange={(e) => setMessage(e.target.value)} aria-invalid={touched && bad.message} />
        </label>
      </div>
      {touched && (bad.name || bad.phone || bad.message) && <p className="err" role="alert">Completá nombre, WhatsApp y mensaje para enviarlo.</p>}
      {error && <p className="err" role="alert">{error}</p>}
      <div className="flex flex-col-reverse gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6" style={{ borderColor: "var(--mist)" }}>
        <p className="mut max-w-[420px] text-[13px] leading-relaxed">Usamos tus datos solo para responderte (Ley 25.326). Podés pedir que los borremos cuando quieras.</p>
        <button type="submit" className="btn go" disabled={sending}>{sending ? "Enviando…" : "Enviar mensaje"}<span className="arrow"><ArrowIcon /></span></button>
      </div>
    </form>
  );
}
