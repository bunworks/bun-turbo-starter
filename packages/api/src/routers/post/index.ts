import { byId } from "./by-id";
import { create } from "./create";
import { deletePost } from "./delete";
import { list } from "./list";

export const postRouter = {
  list,
  byId,
  create,
  // `delete` is a reserved word — aliased from deletePost
  delete: deletePost,
};
