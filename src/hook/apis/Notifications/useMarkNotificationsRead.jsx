import { useMutation, useQueryClient } from "@tanstack/react-query";
import custAxios from "../../../config/axios.config";

export const useMarkNotificationsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload = {}) => {
      const response = await custAxios.put("/notification", payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (err) => {
      console.error("Error marking notifications as read:", err);
    },
  });
};

export default useMarkNotificationsRead;
