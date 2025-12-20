---
inclusion: manual
---

// Пример использования useQuery с tRPC

import { useTRPC } from "~/trpc/react";
import { useQuery } from "@tanstack/react-query";

function BrandDetails({ brandId }: { brandId: string }) {
const trpc = useTRPC();

// Создаем опции запроса с помощью queryOptions
const brandQueryOptions = trpc.brands.getById.queryOptions({ id: brandId });

// Используем опции с хуком useQuery
const { data, isPending, error } = useQuery(brandQueryOptions);

if (isLoading) return <div>Загрузка...</div>;
if (error) return <div>Ошибка: {error.message}</div>;

return (

<div>
<h1>{data.name}</h1>
<p>{data.description}</p>
</div>
);
}

// Пример использования useMutation с tRPC

import { useTRPC } from "~/trpc/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

function CreateBrandForm() {
const trpc = useTRPC();
const queryClient = useQueryClient();

// Создаем опции мутации с помощью mutationOptions
const createBrandMutationOptions = trpc.brands.create.mutationOptions({
onSuccess: (data) => {
// Инвалидируем кэш запроса списка брендов
queryClient.invalidateQueries({
queryKey: trpc.brands.getAll.queryKey()
});

      // Дополнительная логика после успешного создания
      toast.success(`Бренд "${data.name}" успешно создан`);
    },
    onError: (error) => {
      toast.error(error.message || "Не удалось создать бренд");
    }

});

// Используем опции с хуком useMutation
const { mutate, isPending} = useMutation(createBrandMutationOptions);

const handleSubmit = (formData) => {
mutate(formData);
};

return (

<form onSubmit={handleSubmit}>
{/_ Форма создания бренда _/}
</form>
);

}
