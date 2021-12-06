import useSWR from "swr";

const useSharedState = (key: string, fallbackData: any) => {
  const { data, mutate } = useSWR(key, { fallbackData });
  return [data, mutate];
};

export const useCurrentBroadcast = () => {
  const [curtBroadcast, setCurtBroadcast] = useSharedState("broadcast", {});
  return { curtBroadcast, setCurtBroadcast };
};
