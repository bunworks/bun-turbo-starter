import { z } from "zod";

// OTP form validation schema
export const otpFormSchema = z.object({
  otp: z
    .string()
    .length(6, "Код должен состоять ровно из 6 цифр")
    .regex(/^\d+$/, "Код должен содержать только цифры"),
});

export type OTPFormData = z.infer<typeof otpFormSchema>;
