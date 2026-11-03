import LoginForm from "@/components/admin/login/LoginForm";
import Image from "next/image";
import logo from "@/public/logomuestra.png";
import React from "react";
import { Metadata } from "next";
import { Card } from "@/components/ui/card";
export const metadata: Metadata = {
  title: "Iniciar sesión | Panel de administración",
  description:
    "Distrito Automotor, concesionaria de vehículos ubicada en Mar del Plata, Buenos Aires",
};

const Login = () => {
  return (
    <>
      <div className="flex justify-center w-full h-fit">
        <Image alt="as" src={logo} className="mx-auto mt-6" width={80} />
      </div>
      <div
        style={{ height: "calc(100vh - 70px)" }}
        className="flex flex-col items-center justify-center w-full dark"
      >
        <Card className="flex flex-col gap-8 p-7 w-fit h-fit dark">
          <span className="text-2xl font-normal text-left " style={{ lineHeight: '20px' }}>
            Iniciar sesión
          </span>
          <LoginForm />
        </Card>
      </div>
    </>
  );
};

export default Login;
