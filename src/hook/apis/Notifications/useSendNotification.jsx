import { useMutation, useQueryClient } from "@tanstack/react-query";
import custAxios from "../../../config/axios.config";
import { toast } from "sonner";

export const useSendNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      try {
        const response = await custAxios.post("/notification/send", payload);
        return response.data;
      } catch (err) {
        if (err?.response?.status === 404) {
          const fallbackRes = await custAxios.put("/auth/push-notfications", {
            title: payload.title,
            body: payload.content || payload.message,
          });
          return fallbackRes.data;
        }
        throw err;
      }
    },
    onSuccess: (data) => {
      toast.success(
        typeof data?.data === "string"
          ? data.data
          : data?.data?.message || "Notification sent successfully!"
      );
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message || err?.message || "Failed to send notification"
      );
    },
  });
};

export default useSendNotification;
