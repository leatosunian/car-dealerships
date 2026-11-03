"use client";
import * as SelectPrimitive from "@radix-ui/react-select";

// Select con el estilo del sitio. Reemplaza al <select> nativo, cuya lista desplegada no se puede estilar.
// Radix no admite items con value "", así que "" se traduce a un valor interno.
const EMPTY = "__vacio__";

type Option = string | { value: string; label: string };

type Props = {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  invalid?: boolean;
  icon?: React.ReactNode;
  className?: string;
  ariaLabel?: string;
  compact?: boolean;
};

const Chevron = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const Check = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
    <path d="M5 12.5l4.5 4.5L19 7" />
  </svg>
);

export default function Select({ value, onChange, options, placeholder, invalid, icon, className = "", ariaLabel, compact }: Props) {
  // El menú se monta dentro de .rb para heredar tipografía y colores del sitio.
  const container = typeof document === "undefined" ? null : document.querySelector<HTMLElement>(".rb");

  const items = options.map((o) => (typeof o === "string" ? { value: o, label: o } : o));
  const toInner = (v: string) => (v === "" ? EMPTY : v);
  const hasValue = items.some((i) => i.value === value);

  return (
    <SelectPrimitive.Root value={hasValue ? toInner(value) : ""} onValueChange={(v) => onChange(v === EMPTY ? "" : v)}>
      <SelectPrimitive.Trigger className={`rb-select${compact ? " compact" : ""} ${className}`} aria-invalid={invalid || undefined} aria-label={ariaLabel}>
        {icon && <span className="rb-select-icon">{icon}</span>}
        <span className="rb-select-value">
          <SelectPrimitive.Value placeholder={placeholder} />
        </span>
        <SelectPrimitive.Icon className="rb-select-chevron"><Chevron /></SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal container={container}>
        <SelectPrimitive.Content position="popper" sideOffset={8} className="rb-select-menu">
          <SelectPrimitive.Viewport className="rb-select-viewport">
            {items.map((item) => (
              <SelectPrimitive.Item key={item.value} value={toInner(item.value)} className="rb-select-item">
                <SelectPrimitive.ItemText>{item.label}</SelectPrimitive.ItemText>
                <SelectPrimitive.ItemIndicator className="rb-select-check"><Check /></SelectPrimitive.ItemIndicator>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
