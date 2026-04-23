import { useQuery } from "@tanstack/react-query";
import custAxios from "../../../config/axios.config";

export const useGetEvents = (filters) => {
  const { data, ...rest } = useQuery({
    queryFn: async () => {
      const data = await custAxios.get("/events", {
        params: { ...filters, limit: filters?.limit || 1000 },
      });
      return data?.data?.data;
    },
    queryKey: ["event", JSON.stringify(filters)],
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    retry: 3,
  });
  return { events: data, ...rest };
};
