import { useMutation, useQueryClient } from "@tanstack/react-query";
import custAxios from "../../../config/axios.config";

import { toast } from "sonner";

export const useDeletedEvent = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading, isPending, isError, error } = useMutation({
    mutationFn: async (id) => {
      try {
        const response = await custAxios.delete(`/events/${id}`);
        toast.success("Event deleted successful");
        queryClient.invalidateQueries({ queryKey: ["event"] });
        return response?.data?.data;
      } catch (err) {
        toast.error(err.response?.data?.message || "Event deleted failed");
        throw err; // Rethrow to let the caller handle it
      }
    },
  });

  return {
    deleteEvent: mutateAsync,
    deleteLoading: isLoading,
    isPending,
    isError,
    error,
  };
};
