Object.defineProperty(exports, "__esModule", { value: true });
exports.unused = void 0;
var v4_1 = require("zod/v4");
exports.unused = v4_1.z
  .string()
  .describe(
    "This lib is currently not used as we use drizzle-zod for simple schemas\n   But as your application grows and you need other validators to share\n   with back and frontend, you can put them in here\n  ",
  );
