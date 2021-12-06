import router from "next/router";
import { Button } from "../../components/Button";
import { Layout } from "../../components/Layout";
import { db } from "../../firebase";
import TextareaAutosize from "react-textarea-autosize";
import { deleteDoc, doc } from "@firebase/firestore";
import { useGetComment } from "../../hooks/useGetComment";
import { NextPage } from "next";

const CommentCheck: NextPage = () => {
  const { comment, isLoading, curtBroadcast, user } = useGetComment();

  const handleEdit = async () => {
    await router.push("/comment/edit");
  };

  const handleDelete = async () => {
    const q = doc(db, "broadcasts", curtBroadcast.id, "comments", comment!.id);
    await deleteDoc(q);

    await router.push("/");
  };

  return (
    <Layout>
      <div className="flex justify-center w-full bg-gray-200">
        <div className=" pt-16 h-screen bg-gray-200 flex flex-col items-center w-full sm:max-w-2xl">
          {isLoading || !comment ? (
            <div className="text-gray-300">Loading ...</div>
          ) : (
            <>
              <div className="mt-10 flex flex-col w-full">
                <div className="flex justify-center">
                  <span className="px-2 rounded-full text-orange-500 bg-orange-200">
                    {curtBroadcast.bstate}
                  </span>
                </div>

                <h2 className="mt-4 font-bold text-2xl bg-gray-200 text-center">
                  {curtBroadcast.title}
                </h2>

                <div className="mt-4 w-full p-3 bg-gray-100 flex flex-col justify-between">
                  {/* <p className="bg-gray-100">{comment.comment}</p> */}

                  <label
                    htmlFor="comment"
                    className="bg-gray-100 flex-1 cursor-text"
                  >
                    <TextareaAutosize
                      id="comment"
                      style={{ caretColor: "#3B82F6" }}
                      className="w-full bg-gray-100 h-full border-none py-3 resize-none  outline-none"
                      value={comment.comment}
                      placeholder="エンジビアを入力する"
                      autoComplete="off"
                      disabled
                    />
                  </label>

                  <div className="flex items-center">
                    <img
                      className="w-8 h-8 rounded-full"
                      src={user.photoUrl}
                      alt="user"
                    />
                    <span className="block ml-2 text-sm text-gray-500">
                      {user.displayName}
                    </span>
                  </div>
                </div>

                <div className="mt-5 flex justify-center space-x-7">
                  <Button
                    variant="solid-blue"
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
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};
export default CommentCheck;
