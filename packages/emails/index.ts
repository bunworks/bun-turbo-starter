import OtpSignInEmail from "./emails/otp-sign-in";
import ResetPasswordEmail from "./emails/reset-password";
import WelcomeEmail from "./emails/welcome";

export { sendEmail, sendEmailHtml } from "./send";
export {
  type EmailTemplate,
  sendTemplateEmail,
  type TemplateEmail,
} from "./templates";
export { OtpSignInEmail, ResetPasswordEmail, WelcomeEmail };
