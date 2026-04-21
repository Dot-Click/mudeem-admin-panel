import { useMutation, useQueryClient } from "@tanstack/react-query";
import custAxios from "../../../config/axios.config";

import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { clearClientAuth } from "../../../utils/auth";

export const useCreateEvents = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutateAsync, isLoading, isPending, isError, error } = useMutation({
    mutationFn: async (payload) => {
      try {
        const response = await custAxios.post("/events", payload);
        toast.success("Event created successful");
        queryClient.invalidateQueries({ queryKey: ["event"] });
        return response?.data?.data;
      } catch (err) {
        const status = err?.response?.status;
        if (status === 401) {
          clearClientAuth();
          toast.error("Not logged in");
          navigate("/");
          throw err;
        }
        toast.error(err.response?.data?.message || "Event created failed");
        throw err; // Rethrow to let the caller handle it
      }
    },
  });

  return {
    createEvent: mutateAsync,
    isLoading,
    isPending,
    isError,
    error,
  };
};
