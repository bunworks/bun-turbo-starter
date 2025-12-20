"use client";

import {
  Button,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  toast,
} from "@acme/ui";
import { type AccountFormValues, accountFormSchema } from "@acme/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import { useTRPC } from "~/trpc/react";

const languages = [
  { label: "English", value: "en" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Spanish", value: "es" },
  { label: "Portuguese", value: "pt" },
  { label: "Russian", value: "ru" },
  { label: "Japanese", value: "ja" },
  { label: "Korean", value: "ko" },
  { label: "Chinese", value: "zh" },
];

export function AccountForm({
  initialData,
}: {
  initialData?: Partial<AccountFormValues>;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: initialData || {
      name: "",
    },
  });

  const updateAccount = useMutation(
    trpc.user.updateAccount.mutationOptions({
      onSuccess: async () => {
        toast.success("Account updated successfully");
        await queryClient.invalidateQueries(trpc.user.pathFilter());
      },
      onError: (err) => {
        toast.error(err.message || "Failed to update account");
      },
    }),
  );

  function onSubmit(data: AccountFormValues) {
    updateAccount.mutate(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground font-medium">
                Name
              </FormLabel>
              <Input placeholder="Your name" {...field} />
              <p className="text-sm text-amber-700/70">
                This is the name that will be displayed on your profile and in
                emails.
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Language Field */}
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground font-medium">
                Language
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((language) => (
                    <SelectItem key={language.value} value={language.value}>
                      {language.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-amber-700/70">
                This is the language that will be used in the dashboard.
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="bg-foreground text-background hover:bg-foreground/90"
          disabled={updateAccount.isPending}
        >
          {updateAccount.isPending ? "Updating..." : "Update account"}
        </Button>
      </form>
    </Form>
  );
}
