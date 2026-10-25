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
  const action = isSignUp ? "Регистрация" : "Вход";
  const actionGenitive = isSignUp ? "регистрации" : "входа";

  return (
    <Html lang="ru">
      <Head />
      <Preview>{`Ваш код для ${actionGenitive} - ${APP_CONFIG.shortName}`}</Preview>
      <Tailwind config={emailTailwindConfig}>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-[40px] w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              {action} в{" "}
              <Link href={env.APP_URL} className="text-black">
                <strong>{APP_CONFIG.shortName}</strong>
              </Link>
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">
              Здравствуйте!
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              Ваш одноразовый код для {actionGenitive}:
            </Text>
            <Text className="my-[20px] text-center text-[24px] font-bold">
              {otp}
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              Введите этот код, чтобы завершить процесс {actionGenitive}. Код
              действителен в течение 10 минут.
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              Если вы не запрашивали этот код, просто проигнорируйте это письмо.
            </Text>
            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
            <Text className="text-[12px] leading-[24px] text-[#666666]">
              Это автоматическое сообщение от {APP_CONFIG.shortName}.
              Пожалуйста, не отвечайте на него.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
