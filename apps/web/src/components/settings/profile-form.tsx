"use client";

import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@acme/ui";
import { type ProfileFormValues, profileFormSchema } from "@acme/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

const defaultValues: ProfileFormValues = {
  username: "shadcn",
  email: "email@example.com",
  bio: "I own a computer.",
};

export function ProfileForm() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });

  function onSubmit(data: ProfileFormValues) {
    console.log(data);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      {/* Avatar section */}
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          {avatarUrl ? (
            <img
              src={avatarUrl || "/placeholder.svg"}
              alt="Avatar"
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <User className="h-8 w-8 text-muted-foreground" />
          )}
        </div>
        <Button
          type="button"
          className="bg-foreground text-background hover:bg-foreground/90"
          onClick={() => document.getElementById("avatar-upload")?.click()}
        >
          Upload image
        </Button>
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const url = URL.createObjectURL(file);
              setAvatarUrl(url);
            }
          }}
        />
      </div>

      {/* Username */}
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          placeholder="shadcn"
          {...form.register("username")}
        />
        <p className="text-sm text-amber-700/70">
          This is your public display name. It can be your real name or a
          pseudonym. You can only change this once every 30 days.
        </p>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Select defaultValue={defaultValues.email}>
          <SelectTrigger>
            <SelectValue placeholder="Select a verified email to display" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="email@example.com">email@example.com</SelectItem>
            <SelectItem value="support@example.com">
              support@example.com
            </SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
          You can manage verified email addresses in your email settings.
        </p>
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          placeholder="Tell us a little bit about yourself"
          className="resize-none"
          {...form.register("bio")}
        />
        <p className="text-sm text-muted-foreground">
          You can @mention other users and organizations to link to them.
        </p>
      </div>

      <Button
        type="submit"
        className="bg-foreground text-background hover:bg-foreground/90"
      >
        Update profile
      </Button>
    </form>
  );
}
