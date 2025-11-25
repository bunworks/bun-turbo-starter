import { eq } from "@acme/db";
import { user } from "@acme/db/schema";

import { protectedProcedure } from "../../trpc";

export const me = protectedProcedure.query(({ ctx }) => {
  return ctx.db.query.user.findFirst({
    where: eq(user.id, ctx.session.user.id),
  });
});
