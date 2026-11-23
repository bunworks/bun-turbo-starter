import { logger } from "@acme/config";
import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import { render } from "@react-email/components";
import nodemailer from "nodemailer";
import type Mail from "nodemailer/lib/mailer";
import type { ReactNode } from "react";
import { Resend } from "resend";

import { env } from "./env";

export const resend = env.RESEND_API_KEY
  ? new Resend(env.RESEND_API_KEY)
  : null;

/**
 * Yandex Cloud Postbox via its SES v2-compatible HTTPS API. Auth is a service
 * account static access key (AWS Signature V4), so no SMTP ports are needed.
 * @see https://yandex.cloud/docs/postbox/operations/send-email
 */
const yandexPostbox = (() => {
  const accessKeyId = env.YANDEX_POSTBOX_ACCESS_KEY_ID;
  const secretAccessKey = env.YANDEX_POSTBOX_SECRET_ACCESS_KEY;
  if (!accessKeyId || !secretAccessKey) return null;
  return new SESv2Client({
    region: env.YANDEX_POSTBOX_REGION,
    endpoint: env.YANDEX_POSTBOX_ENDPOINT,
    credentials: { accessKeyId, secretAccessKey },
  });
})();

export interface Emails {
  react: ReactNode;
  subject: string;
  to: string[];
  from?: string;
}

export type EmailHtml = {
  html: string;
  subject: string;
  to: string[];
  from?: string;
};

type OutgoingEmail = {
  from: string;
  to: string[];
  subject: string;
  html: string;
  text?: string;
};

export type EmailProvider = {
  name: string;
  send: (email: OutgoingEmail) => Promise<void>;
};

/** Configured providers, in send order: Yandex Postbox, then Resend. */
function configuredProviders(): EmailProvider[] {
  const providers: EmailProvider[] = [];

  if (yandexPostbox) {
    providers.push({
      name: "yandex-postbox",
      send: async (email) => {
        await yandexPostbox.send(
          new SendEmailCommand({
            FromEmailAddress: email.from,
            Destination: { ToAddresses: email.to },
            Content: {
              Simple: {
                Subject: { Data: email.subject, Charset: "UTF-8" },
                Body: {
                  Html: { Data: email.html, Charset: "UTF-8" },
                  ...(email.text
                    ? { Text: { Data: email.text, Charset: "UTF-8" } }
                    : {}),
                },
              },
            },
          }),
        );
      },
    });
  }

  const resendClient = resend;
  if (resendClient) {
    providers.push({
      name: "resend",
      send: async (email) => {
        const { error } = await resendClient.emails.send({
          from: email.from,
          to: email.to,
          subject: email.subject,
          html: email.html,
        });
        // Resend reports failures in the result instead of rejecting.
        if (error) throw new Error(`${error.name}: ${error.message}`);
      },
    });
  }

  return providers;
}

/** Sends with the first provider that accepts the email. */
export async function sendWithFallback(
  email: OutgoingEmail,
  providers: readonly EmailProvider[],
): Promise<string | null> {
  if (providers.length === 0) {
    logger.warn("email.provider_not_configured", {
      hint: "Set YANDEX_POSTBOX_ACCESS_KEY_ID and YANDEX_POSTBOX_SECRET_ACCESS_KEY, or RESEND_API_KEY, in .env for emails to work",
    });
    return null;
  }

  const failures: { provider: string; error: unknown }[] = [];

  for (const [index, provider] of providers.entries()) {
    try {
      await provider.send(email);
      return provider.name;
    } catch (error) {
      failures.push({ provider: provider.name, error });
      logger.error("email.send_failed", error, {
        provider: provider.name,
        fallback: providers[index + 1]?.name ?? null,
      });
    }
  }

  throw new AggregateError(
    failures.map((failure) => failure.error),
    `All email providers failed: ${failures
      .map((failure) => failure.provider)
      .join(", ")}`,
  );
}

async function send(email: OutgoingEmail): Promise<void> {
  if (env.EMAIL_SANDBOX_ENABLED) {
    const mailOptions: Mail.Options = {
      from: email.from,
      to: email.to,
      html: email.html,
      text: email.text,
      subject: email.subject,
    };
    // inbucket from docker-compose
    const transporter = nodemailer.createTransport({
      host: env.EMAIL_SANDBOX_HOST,
      secure: false,
      port: 2500,
    });
    await transporter.sendMail(mailOptions);
    return;
  }

  await sendWithFallback(email, configuredProviders());
}

export const sendEmail = async (email: Emails) => {
  const [html, text] = await Promise.all([
    render(email.react),
    render(email.react, { plainText: true }),
  ]);

  return send({
    from: email.from ?? env.EMAIL_FROM,
    to: email.to,
    subject: email.subject,
    html,
    text,
  });
};

export const sendEmailHtml = async (email: EmailHtml) =>
  send({
    from: email.from ?? env.EMAIL_FROM,
    to: email.to,
    subject: email.subject,
    html: email.html,
  });
