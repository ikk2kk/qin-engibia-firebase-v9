import { useRouter } from "next/router";
import { Button } from "../../components/Button";
import { InputForm } from "../../components/InputForm";

import { Layout } from "../../components/Layout";
import { db } from "../../firebase";
import { useForm } from "react-hook-form";
import { addDoc, collection, serverTimestamp } from "@firebase/firestore";
import { useCheckSigninAdminUser } from "../../hooks/useCheckSigninAdminUser";

type Form = {
  title: string;
  startDate: string;
};

const BroadcastNew = () => {
  const router = useRouter();

  const { user } = useCheckSigninAdminUser();

  const { register, handleSubmit, formState } = useForm<Form>({
    reValidateMode: "onSubmit",
    defaultValues: {
      title: "",
      startDate: "",
    },
  });

  const handleSave = handleSubmit(async (formData) => {
    addDoc(collection(db, "broadcasts"), {
      title: formData.title,
      bdate: formData.startDate,
      timestamp: serverTimestamp(),
      bstate: "放送前・エンジビア募集中",
      uid: user.uid,
      username: user.displayName,
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
          {!user.uid || !user.admin ? (
            <div className="text-gray-300">Loading ... </div>
          ) : (
            <>
              <h2 className="py-8 font-bold w-full text-2xl">放送を作成</h2>

              <div className="w-full">
                <InputForm
                  label=""
                  placeholder="タイトルを入力"
                  error={formState.errors.title?.message}
                  {...register("title", {
                    required: "タイトルを入力してください",
                    maxLength: {
                      value: 100,
                      message: "100文字以下にしてください",
                    },
                  })}
                />
              </div>
              <div className="w-full mt-6">
                <InputForm
                  label=""
                  // type="text"
                  placeholder="開始日を入力 (例：2021/09/03)"
                  error={formState.errors.startDate?.message}
                  {...register("startDate", {
                    required: "開始日を入力してください",
                    pattern: {
                      value: new RegExp(
                        "^[0-9]{4}/(0[1-9]|1[0-2])/(0[1-9]|[12][0-9]|3[01])$"
                      ),
                      message: "yyyy/mm/ddの形式で入力してください",
                    },
                  })}
                />
              </div>

              <div className="mt-12 flex justify-center space-x-7">
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
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BroadcastNew;
