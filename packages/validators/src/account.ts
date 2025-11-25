import { z } from "zod";

export const accountFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(30, { message: "Name must not be longer than 30 characters." }),
  dob: z.date({ message: "A date of birth is required." }).optional(),
  language: z.string({ message: "Please select a language." }).optional(),
});

export type AccountFormValues = z.infer<typeof accountFormSchema>;
