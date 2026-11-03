// A diferencia del layout, el template se vuelve a montar en cada navegación:
// eso dispara la animación de entrada de la página nueva (header y footer quedan fijos).
export default function PublicTemplate({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
