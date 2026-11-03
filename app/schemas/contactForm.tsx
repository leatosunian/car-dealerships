import { z } from "zod";

export const formSchema = z.object({
  name: z.string({ message: "Ingrese un nombre." }).min(1, {
    message: "Ingrese un nombre.",
  }),
  surname: z
    .string({
      message: "Ingrese un apellido..",
    })
    .min(3, {
      message: "Ingrese un apellido.",
    }),
  vehicleInfo: z.string().min(1, {
    message: "Ingrese un vehículo.",
  }),
  vehicleYear: z.string().min(1, {
    message: "Ingrese un año.",
  }),
  vehicleKm: z.string().min(1, {
    message: "Ingrese un kilometraje.",
  }),
  phone: z.string().min(1, {
    message: "Ingrese un teléfono.",
  }),
});
