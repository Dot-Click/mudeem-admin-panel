import { useMutation, useQueryClient } from "@tanstack/react-query";
import  { formAxios } from "../../../../config/axios.config";
import { toast } from "sonner";

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading, isPending, isError, error } = useMutation({
    mutationFn: async (payload) => {
      try {
        const response = await formAxios.post("/shop/product", payload);
        toast.success("Product created successful");
        queryClient.invalidateQueries("product");
        return response?.data?.data;
      } catch (err) {
        toast.error(err.response?.data?.message || "Product created failed");
        throw err; // Rethrow to let the caller handle it
      }
    },
  });

  return {
    createProduct: mutateAsync,
    isLoading,
    isPending,
    isError,
    error,
  };
};
