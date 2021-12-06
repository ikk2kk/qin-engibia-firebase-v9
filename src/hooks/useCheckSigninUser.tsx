import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser } from "../features/userSlice";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/dist/client/router";
import { useEffect } from "react";

export const useCheckSigninUser = () => {
  const router = useRouter();
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (authUser) => {
      if (!authUser) {
        dispatch(logout());
      }
    });
    return () => {
      unSub();
    };
  }, [dispatch]);

  useEffect(() => {
    if (!user.uid) {
      router.push("/signin");
    }
  }, [user]);

  return { user };
};
