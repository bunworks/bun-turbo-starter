import { Suspense } from "react";
import { AccountForm } from "~/components/settings/account-form";
import {
  SettingsFormSkeleton,
  SettingsHeader,
  SettingsShell,
} from "~/components/settings/settings-shell";
import { SettingsSidebar } from "~/components/settings/settings-sidebar";
import { api } from "~/orpc/server";

export default function SettingsAccountPage() {
  return (
    <SettingsShell header={<SettingsHeader />} sidebar={<SettingsSidebar />}>
      {/* The shell is prerendered; only the user's data waits for the request. */}
      <Suspense fallback={<SettingsFormSkeleton />}>
        <AccountFormWithData />
      </Suspense>
    </SettingsShell>
  );
}

async function AccountFormWithData() {
  const user = await api.user.me();

  return (
    <AccountForm
      initialData={{
        name: user?.name || "",
        language: user?.language || "ru",
      }}
    />
  );
}
