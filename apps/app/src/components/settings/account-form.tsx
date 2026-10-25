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

import { orpc } from "~/orpc/react";

const languages = [
  { label: "Русский", value: "ru" },
  { label: "Английский", value: "en" },
  { label: "Французский", value: "fr" },
  { label: "Немецкий", value: "de" },
  { label: "Испанский", value: "es" },
  { label: "Португальский", value: "pt" },
  { label: "Японский", value: "ja" },
  { label: "Корейский", value: "ko" },
  { label: "Китайский", value: "zh" },
];

export function AccountForm({
  initialData,
}: {
  initialData?: Partial<AccountFormValues>;
}) {
  const queryClient = useQueryClient();

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: initialData || {
      name: "",
    },
  });

  const updateAccount = useMutation({
    ...orpc.user.updateAccount.mutationOptions(),
    onSuccess: async () => {
      toast.success("Аккаунт успешно обновлён");
      await queryClient.invalidateQueries({
        queryKey: orpc.user.key(),
      });
    },
    onError: (err: Error) => {
      toast.error(err.message || "Не удалось обновить аккаунт");
    },
  });

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
              <FormLabel className="text-foreground font-medium">Имя</FormLabel>
              <Input placeholder="Ваше имя" {...field} />
              <p className="text-sm text-amber-700/70">
                Это имя будет отображаться в вашем профиле и в письмах.
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
                Язык
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Выберите язык" />
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
                Этот язык будет использоваться в панели управления.
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
          {updateAccount.isPending ? "Обновление…" : "Обновить аккаунт"}
        </Button>
      </form>
    </Form>
  );
}
