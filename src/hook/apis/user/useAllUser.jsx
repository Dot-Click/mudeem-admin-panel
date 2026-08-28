import { useQuery } from "@tanstack/react-query";
import custAxios from "../../../config/axios.config";

export const useGetUsers = (filters = {}) => {
  const { data, ...rest } = useQuery({
    queryFn: async () => {
      const response = await custAxios.get("/user", { params: filters });
      return Array.isArray(response?.data?.data) ? response.data.data : [];
    },
    queryKey: ["user", filters?.search || ""],
    refetchOnWindowFocus: true,
    staleTime: 5000,
    retry: 2,
  });
  return { user: data || [], ...rest };
};
