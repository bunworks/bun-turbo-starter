import { AccountForm } from "~/components/settings/account-form";
import { SettingsSidebar } from "~/components/settings/settings-sidebar";
import { api } from "~/trpc/server";

export default async function SettingsAccountPage() {
  const caller = await api();
  const user = await caller.user.me();

  return (
    <div className="space-y-6 p-10 pb-16 max-w-5xl">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and set e-mail preferences.
        </p>
      </div>
      <div className="flex flex-col gap-6 lg:flex-row">
        <aside className="lg:w-[240px] shrink-0">
          <div className="rounded-lg border p-2">
            <SettingsSidebar />
          </div>
        </aside>
        <div className="flex-1">
          <div className="rounded-lg border p-6">
            <AccountForm
              initialData={{
                name: user?.name || "",
                language: user?.language || "en",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
