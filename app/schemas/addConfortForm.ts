import { z } from "zod";

export const formSchema = z.object({
    key: z.string({ message: "Ingresa un dato." }).min(1, {
        message: "Ingresa un dato.",
    }),
    value: z
        .string({
            message: "Ingresa un valor.",
        })
        .min(1, {
            message: "Ingresa un valor.",
        }),

});
