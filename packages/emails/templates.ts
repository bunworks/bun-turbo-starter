import OtpSignInEmail from "./emails/otp-sign-in";
import ResetPasswordEmail from "./emails/reset-password";
import WelcomeEmail from "./emails/welcome";
import { sendEmail } from "./send";

const templates = {
  "otp-sign-in": OtpSignInEmail,
  "reset-password": ResetPasswordEmail,
  welcome: WelcomeEmail,
};

export type EmailTemplate = keyof typeof templates;

/**
 * A template email as plain JSON: template name + props instead of a React
 * element, so it can cross a process boundary (a Hatchet task input) and be
 * rendered by whoever sends it.
 */
export type TemplateEmail = {
  [T in EmailTemplate]: {
    template: T;
    to: string[];
    subject: string;
    props: Parameters<(typeof templates)[T]>[0];
  };
}[EmailTemplate];

/** Renders `message.template` with its props and sends it. */
export function sendTemplateEmail(message: TemplateEmail) {
  const { template, to, subject, props } = message;
  // The union guarantees `props` matches `template`; TS can't correlate the
  // two through the lookup, hence the widened component type.
  const Template = templates[template] as (props: unknown) => React.ReactNode;

  return sendEmail({ to, subject, react: Template(props) });
}
