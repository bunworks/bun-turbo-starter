import { ProfileForm } from "~/components/settings/profile-form";
import {
  SettingsHeader,
  SettingsShell,
} from "~/components/settings/settings-shell";
import { SettingsSidebar } from "~/components/settings/settings-sidebar";
import { api } from "~/orpc/server";

export const dynamic = "force-dynamic";

export default async function SettingsProfilePage() {
  const user = await api.user.me();

  return (
    <SettingsShell header={<SettingsHeader />} sidebar={<SettingsSidebar />}>
      <ProfileForm
        initialData={{
          username: user?.username || "",
          email: user?.email || "",
          bio: user?.bio || "",
        }}
      />
    </SettingsShell>
  );
}
