import type { Metadata } from "next";
import { Onest, IBM_Plex_Mono } from "next/font/google";
import "@/app/globals.css";
import "./ribera.css";
import { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import MobileBar from "@/components/site/MobileBar";
import { site } from "@/lib/site";

const onest = Onest({ subsets: ["latin"], display: "swap", variable: "--font-onest" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], display: "swap", variable: "--font-plex-mono" });

export const metadata: Metadata = {
  title: {
    default: `${site.fullName} | 0km y usados seleccionados`,
    template: `%s | ${site.fullName}`,
  },
  description: "0km de todas las marcas, usados revisados uno por uno, toma de usados y financiación en el día.",
};

export default function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={`rb relative min-h-screen ${onest.variable} ${plexMono.variable}`}>
      <SiteHeader />
      <Suspense>{children}</Suspense>
      <SiteFooter />
      <MobileBar />
      <Toaster />
    </div>
  );
}
