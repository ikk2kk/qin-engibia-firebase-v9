import type { NextPage } from "next";
import { BroadcastList } from "../components/BroadcastList";
import { Button } from "../components/Button";
import { Layout } from "../components/Layout";
import { useCheckSigninUser } from "../hooks/useCheckSigninUser";

const Home: NextPage = () => {
  const { user } = useCheckSigninUser();

  return (
    <Layout>
      <div className="flex justify-center w-full bg-gray-200">
        <div className=" pt-16 h-screen bg-gray-200 flex flex-col items-center w-full sm:max-w-2xl">
          {!user.uid ? (
            <div className="text-gray-300">Loading ... </div>
          ) : (
            <>
              <h2 className="py-8 font-bold w-full text-2xl">放送一覧</h2>

              <BroadcastList />

              {user.admin ? (
                <Button
                  variant="solid-blue"
                  className="px-4 py-2 mt-6 rounded"
                  linkProps={{ href: "/broadcast/new" }}
                >
                  放送を作成する
                </Button>
              ) : null}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Home;
