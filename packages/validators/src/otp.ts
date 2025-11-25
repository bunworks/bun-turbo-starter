import { z } from "zod/v4";

// OTP form validation schema
export const otpFormSchema = z.object({
  otp: z
    .string()
    .length(6, "Code must be exactly 6 digits")
    .regex(/^\d+$/, "Code must contain only digits"),
});

export type OTPFormData = z.infer<typeof otpFormSchema>;
