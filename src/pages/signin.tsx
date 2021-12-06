import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../components/Button";
import { GoogleIcon } from "../components/icon/GoogleIcon";
import { login, logout, selectUser } from "../features/userSlice";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";

const signInGoogle = async () => {
  await signInWithPopup(auth, provider).catch((err) => alert(err.message));
};

const Signin: NextPage = () => {
  const router = useRouter();
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        const temp = await authUser.getIdTokenResult();
        dispatch(
          login({
            uid: authUser.uid,
            photoUrl: authUser.photoURL,
            displayName: authUser.displayName,
            admin: temp.claims.admin,
          })
        );
      } else {
        dispatch(logout());
      }
    });

    return () => {
      unSub();
    };
  }, [dispatch]);

  useEffect(() => {
    if (user.uid) {
      router.push("/");
    }
  }, [user]);

  return (
    <div className="grid grid-cols-7 bg-gray-200">
      <div className="col-span-3 h-screen flex flex-col justify-center items-center bg-gray-200">
        <img src="/img/logo.png" alt="logo" width={64} height={68} />
        <div className="mt-6 text-3xl font-extrabold text-blue-700">
          エンジビアの泉
        </div>
        <div className="mt-2 text-sm font-semibold text-blue-400">
          〜素晴らしきプログラミングマメ知識〜
        </div>
        <Button
          variant="solid-white"
          className="py-3 px-3 font-bold rounded-md mt-8 bg-gray-200 border border-gray-400 hover:bg-gray-200"
          onClick={signInGoogle}
        >
          <div className="flex">
            <GoogleIcon className="mr-3" />
            <span>Sign in with Google</span>
          </div>
        </Button>
      </div>
      <div className="col-span-4 bg-gray-200 h-screen bg-center bg-cover bg-decorative"></div>
    </div>
  );
};
export default Signin;
