import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

import { emailTailwindConfig } from "../tailwind";

export default function ResetPasswordEmail({
  resetLink = "https://example.com/auth/reset-password?token=abc123",
}: {
  resetLink?: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>Reset your password - Acme</Preview>
      <Tailwind config={emailTailwindConfig}>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-[40px] w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              Reset your password for{" "}
              <Link
                href="https://bun-turbo-starter.vercel.app"
                className="text-black"
              >
                <strong>Acme</strong>
              </Link>
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">
              Hello,
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              We received a request to reset your password. Click the button
              below to create a new password:
            </Text>
            <Section className="my-[32px] text-center">
              <Button
                className="rounded bg-[#000000] px-[20px] py-[12px] text-center text-[14px] font-semibold text-white no-underline"
                href={resetLink}
              >
                Reset Password
              </Button>
            </Section>
            <Text className="text-[14px] leading-[24px] text-black">
              Or copy and paste this URL into your browser:
            </Text>
            <Link
              href={resetLink}
              className="text-[14px] text-blue-600 no-underline"
            >
              {resetLink}
            </Link>
            <Text className="text-[14px] leading-[24px] text-black">
              This link will expire in 1 hour for security reasons.
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              If you didn't request a password reset, please ignore this email
              or contact support if you have concerns.
            </Text>
            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
            <Text className="text-[12px] leading-[24px] text-[#666666]">
              This is an automated message from Acme. Please do not reply to
              this email.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
