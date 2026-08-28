import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formAxios } from "../../../config/axios.config";
import { toast } from "sonner";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profileData) => {
      const formData = new FormData();
      if (profileData.name) formData.append("name", profileData.name);
      if (profileData.email) formData.append("email", profileData.email);
      if (profileData.phone) formData.append("phone", profileData.phone);
      if (profileData.username) {
        formData.append("username", profileData.username);
      } else if (profileData.name) {
        formData.append("username", profileData.name);
      }
      if (
        profileData.profilePicture &&
        typeof profileData.profilePicture !== "string"
      ) {
        formData.append("profilePicture", profileData.profilePicture);
      }

      const response = await formAxios.put("/auth/updateProfile", formData);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Profile update failed");
    },
  });
};