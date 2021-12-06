import { useRouter } from "next/router";
import { Button } from "../../components/Button";
import { Layout } from "../../components/Layout";
import { db } from "../../firebase";
import { TextareaForm } from "../../components/TextareaForm";
import { useForm } from "react-hook-form";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useCheckCurtBroadcast } from "../../hooks/useCheckCurtBroadcast";
import { useCheckSigninUser } from "../../hooks/useCheckSigninUser";
import { NextPage } from "next";

type Form = {
  comment: string;
};

const CommentNew: NextPage = () => {
  const router = useRouter();

  const { curtBroadcast } = useCheckCurtBroadcast();

  const { user } = useCheckSigninUser();

  const { register, handleSubmit, formState } = useForm<Form>({
    reValidateMode: "onSubmit",
    defaultValues: {
      comment: "",
    },
  });

  const handleSave = handleSubmit(async (formData) => {
    addDoc(collection(db, "broadcasts", curtBroadcast.id, "comments"), {
      uid: user.uid,
      username: user.displayName,
      avatar: user.photoUrl,
      comment: formData.comment,
      timestamp: serverTimestamp(),
      cstate: "フィーチャー前",
    });

    await router.push("/");
  });

  const handleCancel = async () => {
    await router.push("/");
  };

  return (
    <Layout>
      <div className="flex justify-center w-full bg-gray-200">
        <div className=" pt-16 h-screen bg-gray-200 flex flex-col items-center w-full sm:max-w-2xl">
          {!curtBroadcast.bstate ? (
            <div className="text-gray-300">Loading ...</div>
          ) : (
            <>
              <div className="mt-10 flex flex-col space-y-4 w-full ">
                <div className="flex justify-center">
                  <span className="px-2 rounded-full text-orange-500 bg-orange-200">
                    {curtBroadcast.bstate}
                  </span>
                </div>
                <h2 className="font-bold w-full text-2xl bg-gray-200 text-center">
                  {curtBroadcast.title}
                </h2>

                <div className="w-full">
                  <TextareaForm
                    label=""
                    placeholder="エンジビアを入力する"
                    error={formState.errors.comment?.message}
                    {...register("comment", {
                      required: "エンジビアを入力してください",
                      maxLength: {
                        value: 100,
                        message: "100文字以下にしてください",
                      },
                    })}
                  />
                </div>

                <div className="flex justify-center space-x-7">
                  <Button
                    variant="solid-blue"
                    className="rounded px-4 py-2"
                    onClick={handleSave}
                  >
                    保存する
                  </Button>
                  <Button
                    variant="solid-lightblue"
                    className="rounded px-4 py-2"
                    onClick={handleCancel}
                  >
                    キャンセル
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
export default CommentNew;
