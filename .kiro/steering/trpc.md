---
inclusion: manual
---

// Example of using useQuery with tRPC

import { useTRPC } from "~/trpc/react";
import { useQuery } from "@tanstack/react-query";

function BrandDetails({ brandId }: { brandId: string }) {
  const trpc = useTRPC();

  // Create query options using queryOptions
  const brandQueryOptions = trpc.brands.getById.queryOptions({ id: brandId });

  // Use options with useQuery hook
  const { data, isPending, error } = useQuery(brandQueryOptions);

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.description}</p>
    </div>
  );
}

// Example of using useMutation with tRPC

import { useTRPC } from "~/trpc/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

function CreateBrandForm() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // Create mutation options using mutationOptions
  const createBrandMutationOptions = trpc.brands.create.mutationOptions({
    onSuccess: (data) => {
      // Invalidate the brands list query cache
      queryClient.invalidateQueries({
        queryKey: trpc.brands.getAll.queryKey()
      });

      // Additional logic after successful creation
      toast.success(`Brand "${data.name}" created successfully`);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create brand");
    }
  });

  // Use options with useMutation hook
  const { mutate, isPending } = useMutation(createBrandMutationOptions);

  const handleSubmit = (formData) => {
    mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Brand creation form */}
    </form>
  );
}
