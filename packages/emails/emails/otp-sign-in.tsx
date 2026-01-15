import { APP_CONFIG, env } from "@acme/config";
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Tailwind,
  Text,
} from "@react-email/components";

import { emailTailwindConfig } from "../tailwind";

export default function OtpSignInEmail({
  otp = "123456",
  isSignUp = false,
}: {
  otp: string;
  isSignUp?: boolean;
}) {
  const action = isSignUp ? "Sign Up" : "Sign In";

  return (
    <Html>
      <Head />
      <Preview>{`Your OTP Code for ${action} - ${APP_CONFIG.shortName}`}</Preview>
      <Tailwind config={emailTailwindConfig}>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-[40px] w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              {action} to{" "}
              <Link href={env.APP_URL} className="text-black">
                <strong>{APP_CONFIG.shortName}</strong>
              </Link>
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">
              Hello,
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              Your One-Time Password (OTP) for {action.toLowerCase()} is:
            </Text>
            <Text className="my-[20px] text-center text-[24px] font-bold">
              {otp}
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              Please use this code to complete your {action.toLowerCase()}{" "}
              process. This code will expire in 10 minutes.
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              If you didn't request this code, please ignore this email.
            </Text>
            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
            <Text className="text-[12px] leading-[24px] text-[#666666]">
              This is an automated message from {APP_CONFIG.shortName}. Please
              do not reply to this email.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
