import { useMutation, useQueryClient } from "@tanstack/react-query";
import custAxios, {  formAxios } from "../../../config/axios.config";
import { toast } from "sonner";

export const useUpdateSetting = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading, isError, error } = useMutation({
    mutationFn: async ({payload,type}) => {
      console.log(type);
      
      try {
        let response;

        if (type === "form") {
          response = await formAxios.put(`/setting`, payload, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        } else {
          response = await custAxios.put(`/setting`, payload, {
            headers: {
              "Content-Type": "application/json",
            },
          });
        }

        toast.success("Setting updated successfully");
        queryClient.invalidateQueries("setting");
        return response?.data?.data;
      } catch (err) {
        toast.error(err.response?.data?.message || "Setting update failed");
        throw err;
      }
    },
  });

  return {
    updateSetting: mutateAsync,
    isLoading,
    isError,
    error,
  };
};

