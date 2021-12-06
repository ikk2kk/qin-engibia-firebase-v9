import { useRouter } from "next/router";
import { Button } from "../../../components/Button";
import { Layout } from "../../../components/Layout";
import { db } from "../../../firebase";
import { useCurrentBroadcast } from "../../../hooks/useSharedState";
import TextareaAutosize from "react-textarea-autosize";
import { useCheckSigninAdminUser } from "../../../hooks/useCheckSigninAdminUser";
import { useCommentListSubscription } from "../../../hooks/useCommentListSubscription";
import {
  collection,
  getDocs,
  query,
  doc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
} from "@firebase/firestore";
import { NextPage } from "next";

const BroadcastId: NextPage = () => {
  const router = useRouter();
  const { user } = useCheckSigninAdminUser();

  const { curtBroadcast } = useCurrentBroadcast();
  const { commentList } = useCommentListSubscription();

  const handleStart = async () => {
    // clear voting_users
    const q = query(collection(db, "voting_users"));
    const votingUsers = await getDocs(q);

    if (!votingUsers.empty) {
      votingUsers.forEach(async (vuser) => {
        const dq = doc(db, "voting_users", vuser.id);
        await deleteDoc(dq);
      });
    }

    // Change voting collection
    const votingCurrentRef = doc(db, "voting", "current");
    await updateDoc(votingCurrentRef, {
      btitle: curtBroadcast.title,
      bstate: "放送中",
      timestamp: serverTimestamp(),
    });

    // Change broadcast state
    const docRef = doc(db, "broadcasts", curtBroadcast.id);
    await updateDoc(docRef, {
      bstate: "放送中",
    });

    // Routing
    await router.push(`/`);
  };

  const handleEdit = async () => {
    await router.push(`/broadcast/${curtBroadcast.id}/edit`);
  };

  const handleDelete = async () => {
    const q = doc(db, "broadcasts", curtBroadcast.id);
    await deleteDoc(q);

    await router.push("/");
  };

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
                      <span className="px-2 rounded-full text-orange-500 bg-orange-200">
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
                        variant="solid-blue"
                        className="rounded px-4 py-2"
                        onClick={handleStart}
                      >
                        放送を開始する
                      </Button>
                      <Button
                        variant="solid-lightblue"
                        className="rounded px-4 py-2"
                        onClick={handleEdit}
                      >
                        編集する
                      </Button>
                      <Button
                        variant="solid-lightblue"
                        className="rounded px-4 py-2"
                        onClick={handleDelete}
                      >
                        削除する
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
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
                        <div
                          key={c.id}
                          className="mt-4 w-full p-3 bg-gray-100 flex flex-col justify-between"
                        >
                          <label
                            htmlFor="comment"
                            className="bg-gray-100 flex-1 cursor-text"
                          >
                            <TextareaAutosize
                              id="comment"
                              style={{ caretColor: "#3B82F6" }}
                              className="w-full bg-gray-100 h-full border-none py-3 resize-none  outline-none"
                              value={c.comment}
                              placeholder="エンジビアを入力する"
                              autoComplete="off"
                              disabled
                            />
                          </label>

                          <div className="flex items-center">
                            <img
                              className="w-8 h-8 rounded-full"
                              src={c.avatar}
                              alt="user"
                            />
                            <span className="block ml-2 text-sm text-gray-500">
                              {c.username}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                <div className="">
                  <div className="bg-gray-300 p-3 text-center rounded-md">
                    フィーチャー中
                  </div>
                </div>
                <div>
                  <div className="bg-gray-300 p-3 text-center rounded-md">
                    フィーチャー後
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BroadcastId;
