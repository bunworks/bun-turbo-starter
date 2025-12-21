import { env } from "./env";

export const APP_CONFIG = {
  name: env.NEXT_PUBLIC_APP_NAME,
  shortName: env.NEXT_PUBLIC_APP_SHORT_NAME,
  url: env.NEXT_PUBLIC_APP_URL,
} as const;
