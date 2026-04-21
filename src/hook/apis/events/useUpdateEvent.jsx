import { useMutation, useQueryClient } from "@tanstack/react-query";
import custAxios from "../../../config/axios.config";
import { toast } from "sonner";

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading, isPending, isError, error } = useMutation({
    mutationFn: async ({ payload, id }) => {
      try {
        const response = await custAxios.put(`/events/${id}`, payload);
        toast.success("Event updated successful");
        queryClient.invalidateQueries({ queryKey: ["event"] });
        return response?.data?.data;
      } catch (err) {
        toast.error(err.response?.data?.message || "Event updated failed");
        throw err; // Rethrow to let the caller handle it
      }
    },
  });

  return {
    updateEvent: mutateAsync,
    isLoading,
    updatePending: isPending,
    isError,
    error,
  };
};
