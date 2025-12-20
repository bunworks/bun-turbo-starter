"use client";

import { Button, Input, Label, Textarea, toast } from "@acme/ui";
import { type ProfileFormValues, profileFormSchema } from "@acme/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { useTRPC } from "~/trpc/react";

export function ProfileForm({
  initialData,
}: {
  initialData?: ProfileFormValues;
}) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: initialData || {
      username: "",
      email: "",
      bio: "",
    },
    mode: "onChange",
  });

  const updateProfile = useMutation(
    trpc.user.updateProfile.mutationOptions({
      onSuccess: async () => {
        toast.success("Profile updated successfully");
        await queryClient.invalidateQueries(trpc.user.pathFilter());
      },
      onError: (err) => {
        toast.error(err.message || "Failed to update profile");
      },
    }),
  );

  function onSubmit(data: ProfileFormValues) {
    updateProfile.mutate(data);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      {/* Avatar section */}
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          {avatarUrl ? (
            <Image
              src={avatarUrl || "/placeholder.svg"}
              alt="Avatar"
              width={64}
              height={64}
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
        <Input
          id="email"
          type="email"
          placeholder="email@example.com"
          {...form.register("email")}
        />
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
        disabled={updateProfile.isPending}
      >
        {updateProfile.isPending ? "Updating..." : "Update profile"}
      </Button>
    </form>
  );
}
