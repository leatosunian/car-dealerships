import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { IoMdAdd, IoMdMore } from "react-icons/io";
import LeadsChart from "@/components/admin/dashboard/leads/LeadsChart";
import Link from "next/link";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Mis leads | Panel de administración",
  description:
    "Telovendo, concesionario de automoviles, Santa Fe, Argentina.",
};

const LeadsPage = () => {
  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-medium ">Mis leads</h2>
        <Link href={"/admin/dashboard/leads/create"}>
          <Button variant="outline" className="flex gap-2 p-2 w-fit h-fit">
            <IoMdAdd size={20} className="w-fit h-fit" />
            <span>Crear lead</span>
          </Button>
        </Link>
      </div>
      <Separator className="mt-4 mb-5 md:mt-4 md:mb-4"></Separator>
      <div>
        <div className="grid gap-0 ">
          {/* chart with branches data */}
          <LeadsChart />
        </div>
      </div>
    </>
  );
};

export default LeadsPage;
