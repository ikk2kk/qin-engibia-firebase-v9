import { useRouter } from "next/router";
import { useEffect } from "react";
import { useCurrentBroadcast } from "./useSharedState";

export const useCheckCurtBroadcast = () => {
  const router = useRouter();
  const { curtBroadcast } = useCurrentBroadcast();
  useEffect(() => {
    if (!curtBroadcast.bstate) {
      handleCancel();
    }
  }, []);

  const handleCancel = async () => {
    await router.push("/");
  };

  return { curtBroadcast };
};
