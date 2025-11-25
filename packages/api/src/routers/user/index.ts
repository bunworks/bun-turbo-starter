import type { TRPCRouterRecord } from "@trpc/server";

import { me } from "./me";
import { updateAccount } from "./update-account";
import { updateProfile } from "./update-profile";

export const userRouter = {
  me,
  updateProfile,
  updateAccount,
} satisfies TRPCRouterRecord;
