import OtpSignInEmail from "./emails/otp-sign-in";
import WelcomeEmail from "./emails/welcome";
import WorkspaceInviteEmail from "./emails/workspace-invite";
import ScriptReportEmail from "./emails/script-report";
import EmailChangeVerification from "./emails/email-change-verification";
import AgentMessageEmail from "./emails/agent-message";

export {
  OtpSignInEmail,
  WelcomeEmail,
  WorkspaceInviteEmail,
  ScriptReportEmail,
  EmailChangeVerification,
  AgentMessageEmail,
};

export { sendEmail, sendEmailHtml } from "./send";
