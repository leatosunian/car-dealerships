import type { Metadata } from "next";
import { getPublicCars } from "@/lib/cars";
import StockView from "@/components/site/StockView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Stock",
  description: "0km y usados seleccionados listos para entregar. Filtrá por marca, carrocería, combustible y año.",
};

export default async function StockPage() {
  const cars = await getPublicCars();
  return (
    <main>
      <StockView cars={cars} />
    </main>
  );
}
