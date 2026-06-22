import { adminStatsRouter } from "./stats";
import { adminUsersRouter } from "./users";

export const adminRouter = {
  users: adminUsersRouter,
  stats: adminStatsRouter,
};
