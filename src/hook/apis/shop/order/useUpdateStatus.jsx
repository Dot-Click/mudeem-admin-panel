import { useMutation, useQueryClient } from "@tanstack/react-query";
import custAxios from "../../../../config/axios.config";
import { toast } from "sonner";

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading, isPending, isError, error } = useMutation({
    mutationFn: async (payload) => {
      console.log(payload);

      try {
        const response = await custAxios.patch(`/shop/order/`, payload);
        toast.success("Order updated successful");
        queryClient.invalidateQueries("order");
        return response?.data?.data;
      } catch (err) {
        toast.error(err.response?.data?.message || "Order updated failed");
        throw err; // Rethrow to let the caller handle it
      }
    },
  });

  return {
    updateOrderStatus: mutateAsync,
    isLoading,
    updatePending: isPending,
    isError,
    error,
  };
};
