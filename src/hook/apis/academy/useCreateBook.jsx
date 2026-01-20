import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formAxios } from "../../../config/axios.config";
import { toast } from "sonner";

export const useCreateBook = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading, isPending, isError, error } = useMutation({
    mutationFn: async (payload) => {
      try {
        const response = await formAxios.post("/academy/book", payload);
        toast.success("Book created successful");
        queryClient.invalidateQueries("book");
        return response?.data?.data;
      } catch (err) {
        toast.error(err.response?.data?.message || "Book created failed");
        throw err; // Rethrow to let the caller handle it
      }
    },
  });

  return {
    createBook: mutateAsync,
    isLoading,
    isPending,
    isError,
    error,
  };
};
