import CarList from "@/components/admin/dashboard/stock/CarList";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import React from "react";
import { IoMdAdd } from "react-icons/io";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Mis vehículos | Panel de administración",
  description:
    "Telovendo, concesionario de automoviles, Santa Fe, Argentina.",
};
const carList = [
  {
    name: "Volkswagen Vento Sportline",
    year: 2016,
    description: "Descripcion",
    kilometers: 120500,
    motor: "2.0 Turbo",
    type: "CAR",
    price: 16500,
    brand: "volkswagen",
    modelName: "Celica",
    status: "AVAILABLE",
    gearbox: "MANUAL",
    doors: "4P",
    gas: "NAFTA",
    currency: "USD",
    show: true,
    uuid: "768fh-dfg356-124d-h45f-dfb3",
    __v: 0,
  },
  {
    name: "Audi S3 Quattro",
    year: 2020,
    description: "Descripcion",
    kilometers: 64500,
    motor: "2.0 TFSI",
    type: "CAR",
    price: 45000,
    brand: "toyota",
    modelName: "Celica",
    status: "AVAILABLE",
    gearbox: "MANUAL",
    doors: "4P",
    gas: "NAFTA",
    currency: "USD",
    show: true,
    uuid: "23124d-1glk-45f-124dh-e34g",
    __v: 0,
  },
  {
    name: "Toyota Celica 2020",
    year: 2020,
    description: "Descripcion",
    kilometers: 64500,
    motor: "1.4 Turbo",
    type: "CAR",
    price: 14350000,
    brand: "toyota",
    modelName: "Celica",
    status: "AVAILABLE",
    gearbox: "MANUAL",
    doors: "4P",
    gas: "NAFTA",
    currency: "ARS",
    show: true,
    uuid: "5345-634-345-h45f-34534h",
    __v: 0,
  },
];

async function getCars() {
  try {
    const carsFetch = await fetch(`${process.env.NEXTAUTH_URL}/api/cars`, {
      method: "GET",
      cache: "no-store",
    });
    const cars = await carsFetch.json();
    return cars;
  } catch (error) {
    return;
  }
}

const StockList = async () => {
  const cars = await getCars();
  return (
    <>
      <div className="flex items-center justify-between ">
        <h2 className="text-xl font-medium md:text-2xl ">Mis vehículos</h2>
        <Link href={"/admin/dashboard/stock/add"}>
          <Button variant="outline" className="flex gap-2 p-2 w-fit h-fit">
            <IoMdAdd size={20} className="w-fit h-fit" />
            <span>Crear vehículo</span>
          </Button>
        </Link>
      </div>
      <Separator className="mt-4 mb-5 md:mt-4 md:mb-4"></Separator>
      <CarList cars={cars} />
    </>
  );
};

export default StockList;
