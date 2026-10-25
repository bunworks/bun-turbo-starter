import { PasswordForm } from "~/components/settings/password-form";
import {
  SettingsHeader,
  SettingsShell,
} from "~/components/settings/settings-shell";
import { SettingsSidebar } from "~/components/settings/settings-sidebar";

export default function SettingsSecurityPage() {
  return (
    <SettingsShell header={<SettingsHeader />} sidebar={<SettingsSidebar />}>
      <div className="flex flex-col gap-1 pb-6">
        <h2 className="text-lg font-semibold tracking-tight">Пароль</h2>
        <p className="text-muted-foreground text-sm">
          Измените пароль, который вы используете для входа.
        </p>
      </div>
      <PasswordForm />
    </SettingsShell>
  );
}
