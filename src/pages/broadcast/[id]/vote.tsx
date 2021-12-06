import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Layout } from "../../../components/Layout";
import { db } from "../../../firebase";
import { useCurrentBroadcast } from "../../../hooks/useSharedState";
import TextareaAutosize from "react-textarea-autosize";
import { useCheckSigninUser } from "../../../hooks/useCheckSigninUser";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "@firebase/firestore";

interface VotingComment {
  id: string;
  btitle: string;
  bstate: string;
  comment: string;
  cavatar: string;
  cusername: string;
  ecount: number;
  enumber: number;
}

interface VotingUser {
  uid: string;
  username: string;
  avatar: string;
  ucount: number;
  timestamp: any;
  enumber: number;
}
const BroadcastVote = () => {
  const router = useRouter();
  const { user } = useCheckSigninUser();
  const { curtBroadcast } = useCurrentBroadcast();
  const [votingComment, setVotingComment] = useState<VotingComment>();
  const [votingUserList, setVotingUserList] = useState<VotingUser[]>([]);
  const [myVote, setMyVote] = useState<VotingUser>();
  const [myVoteLoading, setMyVoteLoading] = useState(true);
  const [votingCommentLoading, setVotingCommentLoading] = useState(true);
  const [isSubPreparing, setIsSubPreparing] = useState(true);

  const [esum, setEsum] = useState(0);

  const handleCancel = async () => {
    await router.push("/");
  };

  const clearMyVote = async (enumber: number) => {
    setMyVote({
      uid: user.uid,
      username: user.displayName,
      avatar: user.photoUrl,
      ucount: 0,
      timestamp: "",
      enumber: enumber,
    });

    const votingUserRef = doc(db, "voting_users", user.uid);
    await setDoc(votingUserRef, {
      timestamp: serverTimestamp(),
      uid: user.uid,
      username: user.displayName,
      avatar: user.photoUrl,
      ucount: 0,
      enumber: enumber,
    });
  };

  const setMyVoteEnumber = async (enumber: number) => {
    setMyVote((d) => {
      if (d) {
        return { ...d, enumber };
      }
    });
    const votingUserRef = doc(db, "voting_users", user.uid);
    await updateDoc(votingUserRef, {
      enumber,
    });
  };
  // 0.
  useEffect(() => {
    if (!curtBroadcast.bstate) {
      handleCancel();
    }
  }, []);

  // 1. get myVote
  const getMyVote = async () => {
    if (user.uid === "") {
      handleCancel();
    } else {
      const votingUserRef = doc(db, "voting_users", user.uid);
      const docSnap = await getDoc(votingUserRef);

      if (docSnap.exists()) {
        setMyVote(docSnap.data() as VotingUser);
      } else {
      }

      setMyVoteLoading(false);
    }
  };

  useEffect(() => {
    getMyVote();
  }, []);

  // 2. get voting Comment
  const getVotingComment = async () => {
    if (!myVoteLoading) {
      const votingCurrentRef = doc(db, "voting", "current");
      const docSnap = await getDoc(votingCurrentRef);

      if (docSnap.exists()) {
        setVotingComment(docSnap.data() as VotingComment);
      } else {
      }

      setVotingCommentLoading(false);
    }
  };

  useEffect(() => {
    getVotingComment();
  }, [myVoteLoading]);

  // 3. Compare enumber myVote and votingComment

  useEffect(() => {
    if (!votingCommentLoading) {
      if (!myVote) {
        if (!votingComment) {
          // 初期値(enumber = 0)をmyVote state, DBに設定
          clearMyVote(0);
        } else {
          // 初期値(enumber = votingComment)をmyVote state, DBに設定
          clearMyVote(votingComment.enumber);
        }
      } else {
        if (!votingComment) {
          // 初期値(enumber = 0)をmyVote stateに設定
          clearMyVote(0);
        } else {
          if (myVote.enumber !== votingComment.enumber) {
            // 初期値(enumber = votingComment)をmyVote stateに設定
            clearMyVote(votingComment.enumber);
          } else {
            // myVoteのデータをそのまま使用するのでstate, db更新は必要なし
          }
        }
      }
      setIsSubPreparing(false);
    }
  }, [votingCommentLoading]);

  // 4 Subscription
  useEffect(() => {
    if (!isSubPreparing) {
      const qVotingUsers = query(
        collection(db, "voting_users"),
        orderBy("timestamp", "desc")
      );
      const unVotingUserSub = onSnapshot(qVotingUsers, (snapshot) => {
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

      // const qVoting = query(
      // 	collection(db, "voting", "current")
      // )
      const unVotingSub = onSnapshot(doc(db, "voting", "current"), (doc) => {
        if (doc.exists()) {
          setVotingComment({
            id: doc.id,
            btitle: doc.data().btitle,
            bstate: doc.data().bstate,
            comment: doc.data().comment,
            cavatar: doc.data().cavatar,
            cusername: doc.data().cusername,
            ecount: doc.data().ecount,
            enumber: doc.data().enumber,
          });
        }
      });

      return () => {
        unVotingUserSub();
        unVotingSub();
      };
    }
  }, [isSubPreparing]);

  // 5.
  const checkVotingComment = async () => {
    if (votingComment!.bstate === "放送済み") {
      // remove voting user
      await deleteDoc(doc(db, "voting_users", user.uid));
      // db.collection("voting_users").doc(user.uid).delete();

      router.push("/");
    } else if (votingComment!.comment === "") {
      clearMyVote(votingComment!.enumber);
    } else {
      // clearMyVote(votingComment.enumber);
      setMyVoteEnumber(votingComment!.enumber);
    }
  };
  useEffect(() => {
    if (!isSubPreparing) {
      checkVotingComment();
    }
  }, [votingComment]);

  useEffect(() => {
    if (!isSubPreparing) {
      let sum = votingUserList.reduce((sum, u) => {
        if (u.enumber === votingComment!.enumber) {
          return sum + u.ucount;
        } else {
          return sum;
        }
      }, 0);

      const activeUserList = votingUserList.filter((u) => {
        return u.enumber === votingComment!.enumber;
      });

      if (activeUserList.length >= 1) {
        sum = (Math.round((sum / activeUserList.length) * 10) / 10) * 5;
      } else {
        sum = 0;
      }

      setEsum(sum);
    }
  }, [votingUserList]);

  const handleButton = async () => {
    if (myVote) {
      const newCount = myVote.ucount + 1;
      setMyVote((d) => {
        if (d) {
          if (newCount <= 20) {
            return { ...d, ucount: newCount };
          } else {
            return { ...d };
          }
        }
      });

      if (newCount <= 20) {
        await updateDoc(doc(db, "voting_users", user.uid), {
          ucount: newCount,
        });
      }
    }
  };

  return (
    <Layout>
      <div className="flex  w-full h-full bg-gray-200">
        <div className="flex-1 bg-gray-200 flex justify-center">
          <div className=" pt-16 h-screen bg-gray-200 flex flex-col items-center w-full sm:max-w-2xl">
            {!user.uid || !votingComment || isSubPreparing ? (
              <div className="text-gray-300">Loading ... </div>
            ) : (
              <div className="w-full">
                <div className="mt-10 flex flex-col w-full">
                  <div className="flex justify-center">
                    <span className="px-2 rounded-full text-green-700 bg-green-200">
                      {curtBroadcast.bstate}
                    </span>
                  </div>
                  <h2 className="font-bold w-full text-2xl bg-gray-200 text-center mt-4">
                    {curtBroadcast.title}
                  </h2>

                  <div className="mt-4 w-full p-3 bg-gray-100 flex flex-col justify-between">
                    {votingComment.comment === "" ? (
                      <div className="text-xl">
                        次のエンジビアをお待ちください
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-center">
                          <h3 className="text-xl font-bold text-blue-500">
                            エンジビア{votingComment.enumber}
                          </h3>
                        </div>
                        <label
                          htmlFor="comment"
                          className="bg-gray-100 flex-1 cursor-text"
                        >
                          <TextareaAutosize
                            id="comment"
                            style={{ caretColor: "#3B82F6" }}
                            className="w-full bg-gray-100 h-full border-none py-3 resize-none  outline-none"
                            value={votingComment.comment}
                            placeholder="エンジビアを入力する"
                            autoComplete="off"
                            disabled
                          />
                        </label>

                        <div className="flex justify-between">
                          <div className="flex items-center mt-3">
                            <img
                              className="w-8 h-8 rounded-full"
                              src={votingComment.cavatar}
                              alt="user"
                            />
                            <span className="block ml-2 text-sm text-gray-500">
                              {votingComment.cusername}
                            </span>
                          </div>
                          <div className="bg-yellow-100 p-3 flex items-end rounded-t-sm">
                            <span className="text-blue-500 text-4xl font-bold">
                              {/* {votingComment.ecount} */}
                              {esum}
                            </span>
                            <span className="text-blue-500">へぇ</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex justify-center mt-28">
                    <div className="flex items-center space-x-8">
                      <button
                        onClick={handleButton}
                        className="font-bold h-28 w-28 text-3xl bg-blue-500 rounded-full text-gray-50 hover:bg-blue-600"
                        disabled={votingComment.comment === "" ? true : false}
                      >
                        へぇ
                      </button>
                      <div className=" text-blue-500">
                        <span className="font-bold text-3xl">
                          {myVote!.ucount}
                        </span>
                        <span className="text-xl">へぇ</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-16 bg-gray-200 w-72 overflow-y-scroll pr-3">
          {!user || !votingComment || !votingComment ? (
            <div></div>
          ) : (
            <>
              {votingUserList.length !== 0 ? (
                <div className="mt-6">
                  {votingUserList.map((user: VotingUser) => {
                    return (
                      <div key={user.uid}>
                        {votingComment &&
                        user.enumber === votingComment.enumber ? (
                          <div
                            key={user.uid}
                            className="flex justify-between items-center py-3 border-b border-gray-300"
                          >
                            <div className="flex space-x-2 items-center">
                              <img
                                className="w-8 h-8 rounded-full"
                                src={user.avatar}
                                alt="user"
                              />
                              <div>{user.username}</div>
                            </div>
                            <div className="rounded-full bg-gray-100 px-2 border border-gray-300">
                              {user.ucount}へぇ
                            </div>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};
export default BroadcastVote;
