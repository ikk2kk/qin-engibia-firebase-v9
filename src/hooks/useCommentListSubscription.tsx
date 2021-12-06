import { useEffect, useState } from "react";
import { db } from "../firebase";

import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { COMMENT } from "../types/types";
import { useCurrentBroadcast } from "./useSharedState";

import { OrderByDirection } from "@firebase/firestore";

export const useCommentListSubscription = (
  timeOrder: OrderByDirection = "desc"
) => {
  const { curtBroadcast } = useCurrentBroadcast();

  const [commentList, setCommentList] = useState<COMMENT[]>([]);

  useEffect(() => {
    let unsubscribe;
    if (curtBroadcast.id) {
      const q = query(
        collection(db, "broadcasts", curtBroadcast.id, "comments"),
        orderBy("timestamp", timeOrder)
      );
      const unSub = onSnapshot(q, (snapshot) => {
        setCommentList(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            comment: doc.data().comment,
            uid: doc.data().uid,
            username: doc.data().username,
            avatar: doc.data().avatar,
            timestamp: doc.data().timestamp,
            cstate: doc.data().cstate,
            ecount: doc.data().ecount,
          }))
        );
      });
      unsubscribe = () => {
        unSub();
      };
      return unsubscribe;
    }
  }, [curtBroadcast]);

  return { commentList };
};
