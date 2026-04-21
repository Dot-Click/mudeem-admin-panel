import { useQuery } from "@tanstack/react-query";
import custAxios from "../../../config/axios.config";

export const useGetMe = () => {
  const { data, ...rest } = useQuery({
    queryFn: async () => {
      const data = await custAxios.get("/auth/me");
      return data?.data?.data;
    },
    queryKey: ["user"],
    refetchOnWindowFocus: false,
    retry: 0,
  });
  return { me: data, ...rest };
};
