import { useQuery } from "@tanstack/react-query";
import custAxios from "../../../config/axios.config";

export const useGetMe = () => {
  const { data, ...rest } = useQuery({
    queryFn: async () => {
      const response = await custAxios.get("/auth/me");
      return response?.data?.data;
    },
    queryKey: ["me"],
    refetchOnWindowFocus: true,
    staleTime: 5000,
    retry: 1,
  });
  return { me: data, ...rest };
};
