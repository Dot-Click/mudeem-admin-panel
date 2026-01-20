import { useMutation, useQueryClient } from "@tanstack/react-query";
import custAxios from "../../../config/axios.config";
import { toast } from "sonner";

export const useDeleteCareer = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading, isPending, isError, error } = useMutation({
    mutationFn: async (id) => {
      try {
        const response = await custAxios.delete(`/careers/${id}`);
        toast.success("Career updated successfully");
        queryClient.invalidateQueries("careers");
        return response?.data?.data;
      } catch (err) {
        toast.error(err.response?.data?.message || "Career update failed");
        throw err; // Rethrow to let the caller handle it
      }
    },
  });

  return {
    deleteCareer: mutateAsync,
    isLoading,
    isPending,
    isError,
    error,
  };
};
