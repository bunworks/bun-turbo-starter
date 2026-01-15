import Link from "next/link";
import { DocsBreadcrumb } from "@/components/docs/docs-breadcrumb";
import { DocsFeedback } from "@/components/docs/docs-feedback";

export const metadata = {
  title: "Type-Safe API (tRPC)",
  description: "Build type-safe APIs with tRPC",
};

export default function ApiPage() {
  return (
    <div className="flex gap-12">
      <article className="docs-content flex-1 max-w-3xl">
        <div className="mb-8">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
            Features
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Type-Safe API (tRPC)
          </h1>
          <p className="text-xl text-muted-foreground">
            Build end-to-end type-safe APIs without code generation.
          </p>
        </div>

        <DocsBreadcrumb
          items={[{ title: "Features" }, { title: "Type-Safe API" }]}
        />

        <h2>What is tRPC?</h2>

        <p>
          tRPC allows you to build fully type-safe APIs without schemas or code
          generation. Your API types are automatically inferred from your
          backend code.
        </p>

        <h2>Benefits</h2>

        <ul>
          <li>
            <strong>End-to-end Type Safety:</strong> Types flow from backend to
            frontend
          </li>
          <li>
            <strong>No Code Generation:</strong> Types are inferred
            automatically
          </li>
          <li>
            <strong>Autocomplete:</strong> Full IDE support with autocomplete
          </li>
          <li>
            <strong>Refactor with Confidence:</strong> Rename safely across your
            codebase
          </li>
        </ul>

        <h2>Example</h2>

        <p>Define a procedure in your API package:</p>

        <pre className="bg-muted rounded-lg p-4 overflow-x-auto my-4">
          <code>{`// packages/api/src/router/post.ts
export const postRouter = router({
  list: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.posts.findMany();
  }),
  
  create: protectedProcedure
    .input(z.object({ title: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.insert(posts).values(input);
    }),
});`}</code>
        </pre>

        <p>Use it in your frontend with full type safety:</p>

        <pre className="bg-muted rounded-lg p-4 overflow-x-auto my-4">
          <code>{`// apps/app/src/app/page.tsx
const { data } = api.post.list.useQuery();
const createPost = api.post.create.useMutation();`}</code>
        </pre>

        <h2>Learn More</h2>

        <p>
          Visit the{" "}
          <Link href="https://trpc.io" target="_blank">
            tRPC documentation
          </Link>{" "}
          for more information.
        </p>

        <div className="my-8">
          <DocsFeedback />
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-border pt-6">
          <Link
            href="/core/monorepo"
            className="group flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform">
              ←
            </span>
            Monorepo Architecture
          </Link>
          <Link
            href="/features/database"
            className="group flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Database
            <span className="group-hover:translate-x-0.5 transition-transform">
              →
            </span>
          </Link>
        </div>
      </article>
    </div>
  );
}
