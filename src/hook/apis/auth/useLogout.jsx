import { useMutation, useQueryClient } from "@tanstack/react-query";
import custAxios from "../../../config/axios.config";
import { toast } from "sonner";
import { clearClientAuth } from "../../../utils/auth";

export const useLogout = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading, isPending, isError, error } = useMutation({
    mutationFn: async () => {
      try {
        const response = await custAxios.get("/auth/logout");
        clearClientAuth();
        await queryClient.removeQueries({ queryKey: ["user"], exact: true });
        // Optional: clear everything react-query cached that might be auth-bound.
        await queryClient.clear();
        toast.success("Logout successful");
        return response?.data?.data;
      } catch (err) {
        // Even if server logout fails, clear client auth so user can re-login.
        clearClientAuth();
        try {
          await queryClient.clear();
        } catch {
          // ignore
        }
        toast.error(err.response?.data?.message || "Logout failed");
        throw err; // Rethrow to let the caller handle it
      }
    },
  });

  return {
    logout: mutateAsync,
    isLoading,
    isPending,
    isError,
    error,
  };
};
