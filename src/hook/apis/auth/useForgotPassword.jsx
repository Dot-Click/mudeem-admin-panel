import { useMutation } from "@tanstack/react-query";
import custAxios from "../../../config/axios.config";
import { toast } from "sonner";

export const useForgotPassword = () => {
  const { mutateAsync, isLoading, isPending, isError, error } = useMutation({
    mutationFn: async (payload) => {
      try {
        const response = await custAxios.post("/auth/forgotPassword", payload);
        toast.success(
          response?.data?.data || "A password reset code has been sent to your email"
        );

        return response?.data?.data;
      } catch (err) {
        // The backend explains why: no account for this email, mail provider
        // failure, or too many attempts. Show its message rather than a
        // generic one.
        toast.error(
          err.response?.data?.message || "Could not send the password reset code"
        );
        throw err; // Rethrow to let the caller handle it
      }
    },
  });

  return {
    forgotPassword: mutateAsync,
    isLoading,
    isPending,
    isError,
    error,
  };
};
