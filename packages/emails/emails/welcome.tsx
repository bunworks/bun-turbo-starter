import { APP_CONFIG, env } from "@acme/config";
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

export default function WelcomeEmail({
  username = "username",
}: {
  username: string;
}) {
  return (
    <Html lang="ru">
      <Head />
      <Preview>Добро пожаловать в {APP_CONFIG.shortName}</Preview>
      <Tailwind config={emailTailwindConfig}>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-[40px] w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              Добро пожаловать в{" "}
              <Link href={env.APP_URL} className="text-black">
                <strong>{APP_CONFIG.shortName}</strong>
              </Link>
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">
              Здравствуйте, {username}!
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              Рады приветствовать вас в {APP_CONFIG.shortName}! Ваш аккаунт
              успешно создан на{" "}
              <Link href={env.APP_URL} className="text-black">
                <strong>{env.APP_URL.replace(/^https?:\/\//, "")}</strong>
              </Link>
              .
            </Text>
            <Section className="mb-[32px] mt-[32px] text-center">
              <Button
                className="rounded bg-[#000000] px-5 py-3 text-center text-[14px] font-semibold text-white no-underline"
                href={env.APP_URL}
              >
                Начать работу
              </Button>
            </Section>
            <Text className="text-[14px] leading-[24px] text-black">
              Если кнопка выше не работает, скопируйте и вставьте эту ссылку в
              браузер:
            </Text>
            <Text className="mb-[20px]">
              <Link href={env.APP_URL} className="text-black no-underline">
                <strong>{env.APP_URL}</strong>
              </Link>
            </Text>
            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
            <Text className="text-[12px] leading-[24px] text-[#666666]">
              Это письмо отправлено на{" "}
              <span className="text-black">{username}</span>. Если вы не
              создавали аккаунт в {APP_CONFIG.shortName}, проигнорируйте это
              письмо или свяжитесь со службой поддержки, если у вас есть
              опасения.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
