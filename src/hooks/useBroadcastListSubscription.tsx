import { useEffect, useState, VFC } from "react";
import { db } from "../firebase";

import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { Broadcast } from "../types/types";

export const useBroadcastListSubscription = () => {
  const [broadcastList, setBroadcastList] = useState<Broadcast[]>([]);

  useEffect(() => {
    const q = query(collection(db, "broadcasts"), orderBy("timestamp", "desc"));
    const unSub = onSnapshot(q, (snapshot) => {
      setBroadcastList(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title,
          bdate: doc.data().bdate,
          timestamp: doc.data().timestamp,
          bstate: doc.data().bstate,
          url: doc.data().url,
        }))
      );
    });

    return () => {
      unSub();
    };
  }, []);

  return { broadcastList };
};
