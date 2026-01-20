import { useMutation, useQueryClient } from "@tanstack/react-query";
import custAxios from "../../../config/axios.config";
import { toast } from "sonner";

export const useCreateCareer = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading, isPending, isError, error } = useMutation({
    mutationFn: async (payload) => {
      try {
        const response = await custAxios.post("/careers/", payload);

        toast.success("Career created successfully!");
        queryClient.invalidateQueries("careers");

        return response?.data?.data;
      } catch (err) {
        toast.error(err.response?.data?.message || "Career creation failed");
        throw err;
      }
    },
  });

  return {
    createCareer: mutateAsync,
    isLoading,
    isPending,
    isError,
    error,
  };
};
