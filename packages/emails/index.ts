import OtpSignInEmail from "./emails/otp-sign-in";
import ResetPasswordEmail from "./emails/reset-password";
import WelcomeEmail from "./emails/welcome";

export { OtpSignInEmail, ResetPasswordEmail, WelcomeEmail };

export { sendEmail, sendEmailHtml } from "./send";
