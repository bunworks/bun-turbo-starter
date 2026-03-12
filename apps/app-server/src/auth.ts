import { initAuth } from "@acme/auth";
import { env } from "@acme/config";
import {
  OtpSignInEmail,
  ResetPasswordEmail,
  WelcomeEmail,
} from "@acme/emails";
import { sendEmail } from "@acme/emails/send";

const baseUrl = env.APP_URL ?? "http://localhost:3000";

const authSecret = env.BETTER_AUTH_SECRET ?? env.AUTH_SECRET;
if (!authSecret) {
  console.warn(
    "BETTER_AUTH_SECRET или AUTH_SECRET не установлен. " +
      "Пожалуйста, установите переменную окружения BETTER_AUTH_SECRET.",
  );
}

export const auth = initAuth({
  baseUrl,
  productionUrl: env.APP_URL ?? "http://localhost:3000",
  secret: authSecret,
  googleClientId: env.AUTH_GOOGLE_ID,
  googleClientSecret: env.AUTH_GOOGLE_SECRET,
  useNextCookies: false, // Standalone server — используем стандартные cookie headers
  sendEmail: async ({
    email,
    otp,
    url,
    type,
  }: {
    email: string;
    otp?: string;
    url?: string;
    type: "sign-in" | "email-verification" | "forget-password" | "change-email";
  }) => {
    if (type === "forget-password") {
      if (!url) {
        throw new Error(
          "Невозможно отправить письмо для сброса пароля: отсутствует URL",
        );
      }
      await sendEmail({
        to: [email],
        subject: "Сброс пароля",
        react: ResetPasswordEmail({ resetLink: url }),
      });
    } else {
      if (!otp) {
        throw new Error(`Невозможно отправить ${type} письмо: отсутствует OTP`);
      }
      await sendEmail({
        to: [email],
        subject: type === "sign-in" ? "Код для входа" : "Подтвердите email",
        react: OtpSignInEmail({ otp, isSignUp: type !== "sign-in" }),
      });
    }
  },
  sendWelcomeEmail: async ({
    email,
    username,
  }: {
    email: string;
    username: string;
  }) => {
    await sendEmail({
      to: [email],
      subject: "Добро пожаловать!",
      react: WelcomeEmail({ username }),
    });
  },
});

/** Получение сессии по headers (для standalone сервера) */
export async function getSession(headers: Headers) {
  return auth.api.getSession({ headers });
}
