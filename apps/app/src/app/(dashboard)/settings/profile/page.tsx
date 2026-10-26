import { Suspense } from "react";
import { ProfileForm } from "~/components/settings/profile-form";
import {
  SettingsFormSkeleton,
  SettingsHeader,
  SettingsShell,
} from "~/components/settings/settings-shell";
import { SettingsSidebar } from "~/components/settings/settings-sidebar";
import { api } from "~/orpc/server";

export default function SettingsProfilePage() {
  return (
    <SettingsShell header={<SettingsHeader />} sidebar={<SettingsSidebar />}>
      {/* The shell is prerendered; only the user's data waits for the request. */}
      <Suspense fallback={<SettingsFormSkeleton />}>
        <ProfileFormWithData />
      </Suspense>
    </SettingsShell>
  );
}

async function ProfileFormWithData() {
  const user = await api.user.me();

  return (
    <ProfileForm
      initialData={{
        username: user?.username || "",
        email: user?.email || "",
        bio: user?.bio || "",
      }}
    />
  );
}
