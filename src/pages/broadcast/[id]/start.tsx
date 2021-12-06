import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button } from "../../../components/Button";
import { Layout } from "../../../components/Layout";
import { db } from "../../../firebase";
import { useCurrentBroadcast } from "../../../hooks/useSharedState";
import { COMMENT } from "../../../types/types";
import { Draggable } from "../../../components/dnd/Draggable";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import type { DragStartEvent } from "@dnd-kit/core";
import { CommentCard } from "../../../components/CommentCard";
import { Droppable } from "../../../components/dnd/Droppable";
import { useCheckSigninAdminUser } from "../../../hooks/useCheckSigninAdminUser";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "@firebase/firestore";

interface VotingUser {
  uid: string;
  username: string;
  avatar: string;
  ucount: number;
  timestamp: any;
  enumber: number;
}

const BroadcastStart = () => {
  const router = useRouter();
  const { user } = useCheckSigninAdminUser();

  const { curtBroadcast } = useCurrentBroadcast();
  const [commentList, setCommentList] = useState<COMMENT[]>([]);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [featuringId, setFeaturingId] = useState("");
  const [finishedIdList, setFinishedIdList] = useState<string[]>([]);
  const [votingUserList, setVotingUserList] = useState<VotingUser[]>([]);

  const updateVotingCurrent = async () => {
    const votingCurrentRef = doc(db, "voting", "current");
    await updateDoc(votingCurrentRef, {
      btitle: curtBroadcast.title,
      bstate: "放送中",
      timestamp: serverTimestamp(),
    });
  };

  useEffect(() => {
    updateVotingCurrent();

    // subscription
    const q = query(
      collection(db, "broadcasts", curtBroadcast.id, "comments"),
      orderBy("timestamp", "desc")
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

    return () => {
      unSub();
    };
  }, [curtBroadcast]);

  useEffect(() => {
    commentList.forEach((c) => {
      if (c.cstate === "フィーチャー中") {
        setFeaturingId(c.id);
      } else if (c.cstate === "フィーチャー後") {
        setFinishedIdList((prevList) => {
          if (!prevList.includes(c.id)) {
            return [...prevList, c.id];
          } else {
            return [...prevList];
          }
        });
      }
    });
  }, [commentList]);

  // Subscription
  useEffect(() => {
    const q = query(
      collection(db, "voting_users"),
      orderBy("timestamp", "desc")
    );
    const unVotingUserSub = onSnapshot(q, (snapshot) => {
      setVotingUserList(
        snapshot.docs.map((doc) => ({
          uid: doc.data().uid,
          username: doc.data().username,
          avatar: doc.data().avatar,
          ucount: doc.data().ucount,
          timestamp: doc.data().timestamp,
          enumber: doc.data().enumber,
        }))
      );
    });

    return () => {
      unVotingUserSub();
    };
  }, []);

  const setCStateDB = async (id: string, cstate: string) => {
    const broadcastCommentRef = doc(
      db,
      "broadcasts",
      curtBroadcast.id,
      "comments",
      id
    );
    await updateDoc(broadcastCommentRef, {
      cstate,
    });
  };

  const setCStateWithEcount = async (id: string, cstate: string) => {
    const sum = votingUserList.reduce((sum, u) => {
      if (u.enumber === finishedIdList.length + 1) {
        return sum + u.ucount;
      } else {
        return sum;
      }
      // return sum + u.ucount;
    }, 0);

    const activeUserList = votingUserList.filter((u) => {
      return u.enumber === finishedIdList.length + 1;
    });

    const broadcastCommentRef = doc(
      db,
      "broadcasts",
      curtBroadcast.id,
      "comments",
      id
    );

    const ecount =
      activeUserList.length >= 1
        ? (Math.round((sum / activeUserList.length) * 10) / 10) * 5
        : 0;
    await updateDoc(broadcastCommentRef, {
      cstate,
      // ecount: (Math.round((sum / activeUserList.length) * 10) / 10) * 5,
      ecount,
    });
  };

  const setVotingCollection = async (cid: string) => {
    const cc = commentList.filter((c) => {
      return c.id === cid;
    });

    const votingCurrentRef = doc(db, "voting", "current");
    await setDoc(votingCurrentRef, {
      btitle: curtBroadcast.title,
      bstate: curtBroadcast.bstate,
      timestamp: serverTimestamp(),
      comment: cc[0].comment,
      cavatar: cc[0].avatar,
      cusername: cc[0].username,
      enumber: finishedIdList.length + 1,
      ecount: 0,
    });
  };

  const clearVotingCollection = async () => {
    const votingCurrentRef = doc(db, "voting", "current");
    await updateDoc(votingCurrentRef, {
      btitle: curtBroadcast.title,
      bstate: curtBroadcast.bstate,
      timestamp: serverTimestamp(),
      comment: "",
      cavatar: "",
      cusername: "",
      // enumber: 0,
      ecount: 0,
    });
  };

  const handleButton = async () => {
    // voting collection

    // broadcasts collection
    const broadcastRef = doc(db, "broadcasts", curtBroadcast.id);
    await updateDoc(broadcastRef, {
      bstate: "放送済み",
    });

    // curtBroadcast
    const votingCurrentRef = doc(db, "voting", "current");
    await updateDoc(votingCurrentRef, {
      btitle: "",
      bstate: "放送済み",
      timestamp: serverTimestamp(),
      comment: "",
      cavatar: "",
      cusername: "",
      enumber: 0,
      ecount: 0,
    });

    await router.push("/");
  };

  const handleDragStart = (e: DragStartEvent) => {
    setActiveId(e.active.id);
  };
  const handleDragEnd = (e: DragEndEvent) => {
    const { over, active } = e;

    let fid = "";
    if (!over) {
      fid = "";
      if (featuringId !== "") {
        setCStateDB(active.id, "フィーチャー前");
        clearVotingCollection();
      } else {
      }
    } else if (over.id === "A") {
      if (featuringId === "") {
        fid = active.id;
        setCStateDB(active.id, "フィーチャー中");

        // setVotingCollection
        setVotingCollection(active.id);
      } else if (featuringId === active.id) {
        fid = active.id;
      } else {
        fid = active.id;
        setCStateDB(active.id, "フィーチャー中");

        // setVotingCollection
        setVotingCollection(active.id);

        setCStateDB(featuringId, "フィーチャー前");
      }
    } else if (over.id === "B") {
      setCStateWithEcount(active.id, "フィーチャー後");
      clearVotingCollection();

      // setCommentsCollection
    } else {
      fid = "";
    }

    setFeaturingId(fid);
  };

  const dragTsx = (id: string) => {
    const filteredComment = commentList.filter((c) => {
      return c.id === id;
    });
    return <CommentCard comment={filteredComment[0]} />;
  };

  const featuringTsx = (id: string) => {
    const filteredComment = commentList.filter((c) => {
      return c.id === id;
    });
    return (
      <Draggable id={id}>
        <CommentCard comment={filteredComment[0]} />
      </Draggable>
    );
  };
  const finishedTsx = (id: string) => {
    const filteredComment = commentList.filter((c) => {
      return c.id === id;
    });
    return <CommentCard comment={filteredComment[0]} />;
  };

  const mouseSensor = useSensor(MouseSensor);
  const keybordSensor = useSensor(KeyboardSensor);
  const pointSensor = useSensor(PointerSensor);
  const touchSensor = useSensor(TouchSensor);
  const sensors = useSensors(
    mouseSensor,
    keybordSensor,
    pointSensor,
    touchSensor
  );

  return (
    <Layout>
      <div className="flex justify-center w-full bg-gray-200 overflow-y-auto">
        <div className=" pt-16 h-screen bg-gray-200 flex flex-col items-center w-full sm:max-w-screen-xl">
          {!user.uid || !user.admin ? (
            <div className="text-gray-300">Loading ... </div>
          ) : (
            <>
              <div className="mt-10 flex flex-col w-full px-5">
                <div className="w-full grid grid-cols-3 gap-4">
                  <div className="col-start-2 col-end-2">
                    <div className="flex justify-center">
                      <span className="px-2 rounded-full text-green-700 bg-green-200">
                        {curtBroadcast.bstate}
                      </span>
                    </div>

                    <h2 className="mt-4 font-bold text-2xl bg-gray-200 text-center">
                      {curtBroadcast.title}
                    </h2>
                  </div>
                  <div className="col-start-3 col-end-3 ">
                    <div className="flex justify-end items-center gap-4 h-full">
                      <Button
                        variant="solid-lightblue"
                        className="rounded px-4 py-2"
                        onClick={handleButton}
                      >
                        放送を終了する
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <DndContext
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                sensors={sensors}
              >
                <div className=" flex-1 w-full  grid grid-cols-3 gap-4 mt-8 px-5">
                  <div>
                    <div className="bg-gray-300 p-3 text-center rounded-md">
                      フィーチャー前
                    </div>
                    {!commentList ? (
                      <div>Nothing</div>
                    ) : (
                      commentList.map((c) => {
                        return (
                          <div key={c.id}>
                            {featuringId === c.id ||
                            c.cstate !== "フィーチャー前" ? null : (
                              /* {c.cstate !== "フィーチャー前" ? null : ( */
                              <Draggable id={c.id}>
                                <CommentCard comment={c} />
                              </Draggable>
                            )}
                          </div>
                        );
                      })
                    )}
                    <DragOverlay>
                      {activeId ? dragTsx(activeId) : null}
                    </DragOverlay>
                  </div>
                  <div className="">
                    <div className="bg-gray-300 p-3 text-center rounded-md">
                      フィーチャー中
                    </div>

                    <div>
                      <Droppable key="A" id="A">
                        {featuringId ? (
                          featuringTsx(featuringId)
                        ) : (
                          <div className="bg-gray-200 border-2 border-dashed border-gray-300 flex justify-center items-center mt-4 font-bold text-gray-400 h-24 w-full">
                            フィーチャーする
                          </div>
                        )}
                      </Droppable>
                    </div>

                    <div className="flex justify-center mt-4">
                      {featuringId !== "" ? (
                        <Button
                          variant="solid-blue"
                          className="rounded px-4 py-2"
                        >
                          タイトルコールする
                        </Button>
                      ) : null}
                    </div>
                  </div>
                  <div>
                    <div className="bg-gray-300 p-3 text-center rounded-md">
                      フィーチャー後
                    </div>

                    {!finishedIdList ? (
                      <div>Nothing</div>
                    ) : (
                      finishedIdList.map((id) => {
                        return <div key={id}>{finishedTsx(id)}</div>;
                      })
                    )}

                    <div></div>
                    <div>
                      <Droppable key="B" id="B">
                        {!featuringId ? null : (
                          <div className="bg-gray-200 border-2 border-dashed border-gray-300 flex justify-center items-center mt-4 font-bold text-gray-400 h-24 w-full">
                            フィーチャーを終える
                          </div>
                        )}
                      </Droppable>
                    </div>
                  </div>
                </div>
              </DndContext>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};
export default BroadcastStart;
