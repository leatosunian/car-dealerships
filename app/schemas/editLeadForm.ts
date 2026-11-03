import { z } from "zod";

export const formSchema = z.object({
  name: z.string({ message: "Ingresá un nombre." }).min(1, {
    message: "Ingresa un nombre.",
  }),
  surname: z
    .string({
      message: "Ingresa un año..",
    })
    .min(4, {
      message: "Ingresa un año.",
    }),
  contactType: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  leadVehicleName: z.string().optional().or(z.literal("")),
  interestedInName: z.string().optional().or(z.literal("")),
  observations: z.string().optional().or(z.literal("")),
  phone: z.string().min(1, {
    message: "Ingresá un teléfono.",
  }),
  employeeID: z.string().min(1, {
    message: "Selecciona un vendedor.",
  }),
});
