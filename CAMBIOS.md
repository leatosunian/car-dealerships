# Cambios hechos por Claude

Como el proyecto ya no tiene `.git`, este archivo reconstruye a mano el **antes** y el **después** de cada cambio. Está ordenado según el momento en que se hizo.

---

## 1. Fix del error `latestVehicles.map is not a function`

### `app/api/cars/latests/route.ts`
`connectDB()` estaba fuera del `try`: si Mongo fallaba, la ruta devolvía un 500 sin manejar. Además, el `catch` devolvía un 200 con un objeto en vez de un array.

```diff
 export async function GET(request: NextRequest, context: any) {
-  await connectDB();
   const { search } = Object.fromEntries(new URL(request.url).searchParams);
   try {
+    await connectDB();
     ...
   } catch (error) {
-    return NextResponse.json({ msg: "ERROR_GET_CAR" });
+    console.error("ERROR_GET_CAR", error);
+    return NextResponse.json({ msg: "ERROR_GET_CAR" }, { status: 500 });
   }
 }
```

### `app/(home)/page.tsx`
Si el fetch fallaba, el loader quedaba girando para siempre y se guardaba algo que no era un array.

```diff
   async function getLastVehicles() {
-    const latestVehicles = await fetch("/api/cars/latests/", {
-      method: "GET",
-      cache: "no-store",
-    });
-    const cars = await latestVehicles.json();
-    if (cars.length !== 0) {
-      setLatestVehicles(cars);
-      setLoading(false);
-    }
-    return latestVehicles;
+    try {
+      const latestVehicles = await fetch("/api/cars/latests/", {
+        method: "GET",
+        cache: "no-store",
+      });
+      if (!latestVehicles.ok) throw new Error(`HTTP ${latestVehicles.status}`);
+      const cars = await latestVehicles.json();
+      if (Array.isArray(cars)) setLatestVehicles(cars);
+    } catch (error) {
+      console.error("Error fetching latest vehicles", error);
+    } finally {
+      setLoading(false);
+    }
   }
```

### `components/page/home/vehicles/vehicle/VehicleCont.tsx`
Llama al mismo endpoint, así que le puse el mismo manejo (sin `setLoading`).

```diff
   async function getLastVehicles() {
-    const latestVehicles = await fetch("/api/cars/latests/", { method: "GET", cache: "no-store" });
-    const cars = await latestVehicles.json();
-
-    if (cars.length !== 0) {
-      setLatestVehicles(cars);
-    }
-    return latestVehicles;
+    try {
+      const latestVehicles = await fetch("/api/cars/latests/", { method: "GET", cache: "no-store" });
+      if (!latestVehicles.ok) throw new Error(`HTTP ${latestVehicles.status}`);
+      const cars = await latestVehicles.json();
+      if (Array.isArray(cars)) setLatestVehicles(cars);
+    } catch (error) {
+      console.error("Error fetching latest vehicles", error);
+    }
   }
```

### `components/page/home/NewProducts.tsx`
El `latestVehicles?.map` de la línea 117 lo habías puesto vos. Yo cambié esto:

```diff
   useEffect(() => {
-    setLatestVehicles(vehicles);
+    setLatestVehicles(Array.isArray(vehicles) ? vehicles : []);
   }, [vehicles]);
```

---

## 2. Migración a Next 16 / React 19

El codemod oficial (`npx @next/codemod@latest upgrade latest`), que corriste vos, actualizó `package.json`, creó `eslint.config.mjs` y cambió el script `lint` a `"eslint ."`. Los cambios de archivos que el codemod no pudo escribir (por los EPERM) los hice yo.

### `params` ahora es una Promise (13 rutas API)
Archivos:
- `app/api/budgets/[budgetID]/route.ts`
- `app/api/budgets/lead/[leadID]/route.ts`
- `app/api/cars/[uuid]/route.ts`
- `app/api/gallery/[uuid]/route.ts`
- `app/api/gallery/getimage/[pathName]/route.ts`
- `app/api/leads/[id]/route.ts`
- `app/api/leads/page/[userID]/route.ts`
- `app/api/leads/page/question/[questionID]/route.ts`
- `app/api/leads/status/[id]/route.ts`
- `app/api/leads/vehicles/[id]/route.ts`
- `app/api/tasks/[id]/route.ts`
- `app/api/tasks/task/[id]/route.ts`

El cambio es igual en todas las funciones (`GET`, `PUT`, `DELETE`, etc.):

```diff
 export async function GET(
   request: NextRequest,
-  { params }: { params: { uuid: string } }
+  props: { params: Promise<{ uuid: string }> }
 ) {
+  const params = await props.params;
   ...el resto queda igual (params.uuid, etc.)
```

`app/api/cars/confort/[carID]/route.ts`, que usaba `context`:

```diff
-  context: { params: { carID: string } }
+  context: { params: Promise<{ carID: string }> }
 ) {
   await connectDB();
-  const { carID } = context.params;
+  const { carID } = await context.params;
```

### `app/api/leads/page/question/[questionID]/route.ts`: el `GET`
Leía `params.userID`, pero el segmento de la ruta se llama `questionID`, así que siempre era `undefined`. Next 16 valida los tipos de las rutas y no compilaba. Este `GET` no se usa en ningún lado (el front solo llama al `PUT`).

```diff
-  { params }: { params: { userID: string } }
+  props: { params: Promise<{ questionID: string }> }
 ) {
+  const params = await props.params;
   ...
-      employeeAsignedID: params.userID,
+      employeeAsignedID: params.questionID,
```

### `app/admin/dashboard/stock/[id]/page.tsx`

```diff
-const EditProduct = ({ params }: { params: { id: string } }) => {
+const EditProduct = async (props: { params: Promise<{ id: string }> }) => {
+  const params = await props.params;
   return (
```

### `middleware.ts` → `proxy.ts`
En Next 16, el middleware pasa a llamarse proxy y tiene que exportar una función, no alcanza con reexportar.

```diff
-// middleware.ts
-export { default } from "next-auth/middleware";
+// proxy.ts
+import { withAuth } from "next-auth/middleware";
+
+export default withAuth(function proxy() {});
+
 export const config = {
   matcher: ["/admin/dashboard/:path*"],
 };
```

### ESLint
- Borré `.eslintrc.json`, la config vieja. Ahora se usa `eslint.config.mjs`, que creó el codemod.

### `app/api/branches/route.ts` y `app/api/budgets/route.ts`
Next 16 no acepta un `NextResponse` como segundo parámetro, y no se usaba.

```diff
-export async function POST(request: NextRequest, response: NextResponse) {
+export async function POST(request: NextRequest) {
```

### `components/page/home/Reveal.tsx`
En React 19 ya no existe el namespace global `JSX`.

```diff
 interface Props {
-  children: JSX.Element;
+  children: React.JSX.Element;
```

### `components/ui/theme-provider.tsx`
`next-themes` 0.4 cambió de dónde se importan los tipos.

```diff
-import { ThemeProvider as NextThemesProvider } from "next-themes"
-import { type ThemeProviderProps } from "next-themes/dist/types"
+import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes"
```

### `package.json`: dependencias

| Paquete | Antes | Después |
|---|---|---|
| next | 14.2.5 | 16.4.2 *(codemod)* |
| react / react-dom | ^18 | 19.3.1 *(codemod)* |
| @types/react / @types/react-dom | ^18 | 19.3.0 *(codemod + yo)* |
| eslint / eslint-config-next | ^8 / 14.2.5 | 9.39.5 / 16.4.2 *(codemod)* |
| next-auth | ^4.24.7 | ^4.24.15 |
| framer-motion | ^11.5.4 | ^14.6.0 |
| cmdk | ^1.0.0 | ^1.1.1 |
| embla-carousel-react / autoplay | ^8.2.0 / ^8.3.0 | ^8.6.0 |
| next-themes | ^0.3.0 | ^0.4.6 |
| react-day-picker | ^8.10.1 | última 8.x |
| @radix-ui/* | varias | todas a la última |
| @types/mongoose | ^5.11.97 | **eliminado** (Mongoose 8 ya trae sus propios tipos) |

### `tsconfig.json`
Lo modificó **Next.js solo** al hacer el primer build: `target: ES2017`, `jsx: react-jsx` y agregó `.next/dev/types/**/*.ts` al `include`.

---

## 3. Errores de consola en `/` después de migrar

### `app/(home)/layout.tsx`
Renderizaba un segundo `<html><body>` adentro del layout raíz, y eso causaba el hydration mismatch.

```diff
-import { Inter } from "next/font/google";
 import "@/app/globals.css";
 ...
-const inter = Inter({ subsets: ["latin"] });
 ...
   return (
-    <html lang="en">
-      <body style={{backgroundColor:'#ededed'}} className={inter.className}>
-        <Suspense>{children}</Suspense>
-        <Link ...>...</Link>
-        <Toaster />
-      </body>
-    </html>
+    <div style={{backgroundColor:'#ededed'}} className="min-h-screen">
+      <Suspense>{children}</Suspense>
+      <Link ...>...</Link>
+      <Toaster />
+    </div>
   );
```

### `app/admin/layout.tsx`
Tenía el mismo problema.

```diff
   return (
-    <html lang="en">
-      <body>
-        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
-          <main>{children}</main>
-          <Toaster />
-        </ThemeProvider>
-      </body>
-    </html>
+    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
+      <main>{children}</main>
+      <Toaster />
+    </ThemeProvider>
   );
```

### `app/layout.tsx`
Agregué `suppressHydrationWarning`, porque `next-themes` modifica el `<html>` y la extensión ColorZilla inyecta un atributo en el `<body>`.

```diff
-      <html lang="en">
+      <html lang="en" suppressHydrationWarning>
 ...
-        <body className={inter.className}>{children}</body>
+        <body className={inter.className} suppressHydrationWarning>{children}</body>
```

### `components/ui/card.tsx`
`CardDescription` era un `<p>` y en varias cards se le ponían `<div>` adentro, que es HTML inválido.

```diff
 const CardDescription = React.forwardRef<
-  HTMLParagraphElement,
-  React.HTMLAttributes<HTMLParagraphElement>
+  HTMLDivElement,
+  React.HTMLAttributes<HTMLDivElement>
 >(({ className, ...props }, ref) => (
-  <p
+  <div
     ref={ref}
```

### `components/page/Header.tsx` y `components/page/home/Search.tsx`
Los atributos SVG en JSX van en camelCase.

```diff
-  stroke-linecap="round"
-  stroke-linejoin="round"
-  stroke-width="2"
+  strokeLinecap="round"
+  strokeLinejoin="round"
+  strokeWidth="2"
```

### `components/page/home/Section2.tsx`
`useViewportScroll` está deprecado en framer-motion.

```diff
-import { motion, useViewportScroll, useTransform } from "framer-motion";
+import { motion, useScroll, useTransform } from "framer-motion";
 ...
-  const { scrollYProgress } = useViewportScroll();
+  const { scrollYProgress } = useScroll();
```
