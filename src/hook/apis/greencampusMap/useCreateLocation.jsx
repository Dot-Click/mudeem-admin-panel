import { useMutation, useQueryClient } from "@tanstack/react-query";
import custAxios from "../../../config/axios.config";

import { toast } from "sonner";

export const useCreateLocation = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading, isPending, isError, error } = useMutation({
    mutationFn: async (payload) => {
      try {
        const response = await custAxios.post("/green-map", payload);
        toast.success("Location created successful");
        queryClient.invalidateQueries("location");
        return response?.data?.data;
      } catch (err) {
        toast.error(err.response?.data?.message || "Location created failed");
        throw err; // Rethrow to let the caller handle it
      }
    },
  });

  return {
    createLocation: mutateAsync,
    isLoading,
    isPending,
    isError,
    error,
  };
};
