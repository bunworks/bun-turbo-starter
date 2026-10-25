import { AccountForm } from "~/components/settings/account-form";
import {
  SettingsHeader,
  SettingsShell,
} from "~/components/settings/settings-shell";
import { SettingsSidebar } from "~/components/settings/settings-sidebar";
import { api } from "~/orpc/server";

export const dynamic = "force-dynamic";

export default async function SettingsAccountPage() {
  const user = await api.user.me();

  return (
    <SettingsShell header={<SettingsHeader />} sidebar={<SettingsSidebar />}>
      <AccountForm
        initialData={{
          name: user?.name || "",
          language: user?.language || "en",
        }}
      />
    </SettingsShell>
  );
}
