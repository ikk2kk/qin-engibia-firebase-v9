import { doc, updateDoc } from "@firebase/firestore";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { Button } from "../../../components/Button";
import { CommentCard } from "../../../components/CommentCard";
import { Input } from "../../../components/Input";
import { Layout } from "../../../components/Layout";
import { db } from "../../../firebase";
import { useBroadcastListSubscription } from "../../../hooks/useBroadcastListSubscription";
import { useCheckSigninUser } from "../../../hooks/useCheckSigninUser";
import { useCommentListSubscription } from "../../../hooks/useCommentListSubscription";
import { useCurrentBroadcast } from "../../../hooks/useSharedState";
import { Broadcast } from "../../../types/types";

const BroadcastResult: NextPage = () => {
  const { user } = useCheckSigninUser();
  const { curtBroadcast } = useCurrentBroadcast();
  const { commentList } = useCommentListSubscription("asc");
  const { broadcastList } = useBroadcastListSubscription();

  const [url, setUrl] = useState("");
  const [subCurtBroadcast, setSubCurtBroadcast] =
    useState<Broadcast>(curtBroadcast);

  useEffect(() => {
    if (broadcastList.length > 0) {
      const filterdBroadcast = broadcastList.filter(
        (b) => b.id === curtBroadcast.id
      );
      if (filterdBroadcast.length > 0) {
        setSubCurtBroadcast(filterdBroadcast[0]);
      }
    }
  }, [broadcastList]);

  const handleSave = async () => {
    // curtBroadcastにyoutubeURLを格納

    const broadcastsRef = doc(db, "broadcasts", curtBroadcast.id);
    await updateDoc(broadcastsRef, {
      url,
    });

    setUrl("");
  };

  return (
    <Layout>
      <div className="flex justify-center w-full bg-gray-200 h-full overflow-y-auto">
        <div className=" pt-16  bg-gray-200 flex flex-col items-center w-full sm:max-w-2xl">
          {!user ? (
            <div className="text-gray-300">Loading ...</div>
          ) : (
            <>
              <div className="mt-10 flex flex-col w-full ">
                <div className="flex justify-center">
                  <span className="px-2 rounded-full bg-gray-100">
                    {curtBroadcast.bstate}
                  </span>
                </div>

                <h2 className="mt-4 font-bold text-2xl bg-gray-200 text-center">
                  {curtBroadcast.title}
                </h2>

                <div className="flex justify-center my-6">
                  {subCurtBroadcast.url ? (
                    <iframe
                      className="w-full h-96"
                      // src="https://www.youtube.com/embed/YyuF2Uw3Qwg"
                      src={subCurtBroadcast.url}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : null}
                </div>
                {user.admin ? (
                  <div className="w-full  flex flex-col items-center space-y-3 my-3">
                    <Input
                      label=""
                      name="name"
                      type="url"
                      placeholder="URLを入力する"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                    />
                    <Button
                      variant="solid-blue"
                      className="rounded px-4 py-2"
                      onClick={handleSave}
                    >
                      保存する
                    </Button>
                  </div>
                ) : null}
                {commentList.length > 0 ? (
                  <>
                    {commentList.map((c, index) => {
                      if (c.ecount === undefined) {
                        return null;
                      }
                      return (
                        <CommentCard
                          key={c.id}
                          comment={c}
                          result
                          resultIndex={index + 1}
                        />
                      );
                    })}
                  </>
                ) : null}
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};
export default BroadcastResult;
