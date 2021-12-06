import { AcademicCapIcon } from "@heroicons/react/solid";
import { useEffect, useState, VFC } from "react";
import { db } from "../firebase";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { COMMENT } from "../types/types";

interface Props {
  broadcastId: string;
}

export const CommentCount: VFC<Props> = (props) => {
  const [comments, setComments] = useState<COMMENT[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, "broadcasts", props.broadcastId, "comments"),
      orderBy("timestamp", "desc")
    );
    const unSub = onSnapshot(q, (snapshot) => {
      setComments(
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

    return () => {
      unSub();
    };
  }, [props.broadcastId]);

  return (
    <div className="flex mt-1 items-center">
      <AcademicCapIcon className="w-5 h-5 text-gray-400" />
      <span className="inline-block ml-1 text-gray-400">
        エンジビア数 {comments.length}
      </span>
    </div>
  );
};
