import { useMutation, useQueryClient } from "@tanstack/react-query";
import custAxios from "../../../config/axios.config";
import { toast } from "sonner";
import { markLoggedIn } from "../../../utils/auth";
// export const useLogin = () => {
//   const { mutateAsync, data, error, isLoading, isError, isSuccess } =
//     useMutation({
//       mutationFn: async (payload) => {
//         const response = await custAxios.post("/auth/login", payload);
//         return response?.data?.data;
//       },
//       onError: (error) => {
//         console.error("Login failed:", error);
//       },
//       onSuccess: (data) => {
//         console.log("Login successful:", data);
//       },
//     });

//   return {
//     login: mutateAsync,
//     data,
//     error,
//     isLoading,
//     isError,
//     isSuccess,
//   };
// };

export const useLogin = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading, isPending, isError, error } = useMutation({
    mutationFn: async (payload) => {
      try {
        const response = await custAxios.post("/auth/login", payload);
        toast.success("Login successful");
        markLoggedIn();
        await queryClient.invalidateQueries({ queryKey: ["user"] });
        return response?.data?.data;
      } catch (err) {
        toast.error(err.response?.data?.message || "Login failed");
        throw err; // Rethrow to let the caller handle it
      }
    },
  });

  return {
    login: mutateAsync,
    isLoading,
    isPending,
    isError,
    error,
  };
};
