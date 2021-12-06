import { collection, getDocs, query, where } from "@firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { COMMENT } from "../types/types";
import { useCheckCurtBroadcast } from "./useCheckCurtBroadcast";
import { useCheckSigninUser } from "./useCheckSigninUser";

export const useGetComment = () => {
  const router = useRouter();

  const { curtBroadcast } = useCheckCurtBroadcast();
  const { user } = useCheckSigninUser();

  const [comment, setComment] = useState<COMMENT>();
  const [isLoading, setIsLoading] = useState(true);

  const getUserComments = async () => {
    if (curtBroadcast.id) {
      const q = query(
        collection(db, "broadcasts", curtBroadcast.id, "comments"),
        where("uid", "==", user.uid)
      );
      const docs = await getDocs(q);

      if (docs.empty) {
        router.push("/");
      }

      docs.forEach((d) => {
        const comment = {
          id: d.id,
          comment: d.data().comment,
          uid: d.data().uid,
          username: d.data().username,
          timestamp: d.data().timestamp,
          avatar: d.data().avatar,
          cstate: d.data().cstate,
          ecount: d.data().ecount,
        };
        setComment(comment);
        setIsLoading(false);
      });
    }
  };
  useEffect(() => {
    getUserComments();
  }, [curtBroadcast]);

  return { comment, isLoading, curtBroadcast, user };
};
