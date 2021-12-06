import { CalendarIcon } from "@heroicons/react/solid";
import { Button } from "../components/Button";
import { VFC } from "react";
import { db } from "../firebase";
import { useCurrentBroadcast } from "../hooks/useSharedState";
import { useRouter } from "next/router";
import { CommentCount } from "./CommentCount";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Broadcast } from "../types/types";
import { useBroadcastListSubscription } from "../hooks/useBroadcastListSubscription";

export const BroadcastList: VFC = () => {
  const router = useRouter();
  const { broadcastList } = useBroadcastListSubscription();
  const { setCurtBroadcast } = useCurrentBroadcast();
  const user = useSelector(selectUser);

  const handleButton = async (broadcast: Broadcast) => {
    // Set global state
    setCurtBroadcast(broadcast);

    if (user.admin) {
      // Admin

      if (broadcast.bstate === "放送中") {
        router.push(`/broadcast/${broadcast.id}/start`);
      } else if (broadcast.bstate === "放送前・エンジビア募集中") {
        router.push(`/broadcast/${broadcast.id}`);
      } else {
        // 放送済み
        router.push(`/broadcast/${broadcast.id}/result`);
      }
    } else {
      // User
      if (broadcast.bstate === "放送中") {
        router.push(`/broadcast/${broadcast.id}/vote`);
      } else if (broadcast.bstate === "放送前・エンジビア募集中") {
        // check user comment
        const q = query(
          collection(db, "broadcasts", broadcast.id, "comments"),
          where("uid", "==", user.uid)
        );
        const doc = await getDocs(q);

        if (doc.empty) {
          // User comment is Empty => New comment
          router.push("/comment/new");
        } else {
          // User comment exists => Edit comment
          router.push("/comment/check");
        }
      } else {
        // 放送済み
        router.push(`/broadcast/${broadcast.id}/result`);
      }
    }
  };

  return (
    <>
      {broadcastList[0]?.id && (
        <>
          {broadcastList.map((broadcast, index) => (
            <div
              key={broadcast.id}
              className={
                index === 0
                  ? "flex flex-col w-full p-4 border-b bg-gray-50 rounded-t"
                  : index === broadcastList.length - 1
                  ? "flex flex-col w-full p-4 border-b bg-gray-50 rounded-b"
                  : "flex flex-col w-full p-4 border-b bg-gray-50"
              }
            >
              <div className="flex justify-between">
                <span className="font-bold text-blue-500">
                  {broadcast.title}
                </span>
                <Button
                  variant={
                    broadcast.bstate === "放送前・エンジビア募集中"
                      ? "solid-orange"
                      : broadcast.bstate === "放送中"
                      ? "solid-green"
                      : "solid-gray"
                  }
                  className="px-2 rounded-full text-sm"
                  onClick={() => handleButton(broadcast)}
                >
                  {broadcast.bstate}
                </Button>
              </div>

              <div className="flex justify-between">
                <div className="flex mt-1 items-center">
                  <CalendarIcon className="w-5 h-5 text-gray-400" />
                  <span className="inline-block ml-1 text-gray-400">
                    {broadcast.bdate}
                  </span>
                </div>
                <CommentCount broadcastId={broadcast.id} />
              </div>
            </div>
          ))}
        </>
      )}
    </>
  );
};
