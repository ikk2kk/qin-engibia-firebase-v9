import { onAuthStateChanged } from "@firebase/auth";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser } from "../features/userSlice";
import { auth } from "../firebase";

export const useCheckSigninAdminUser = () => {
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
    if (!user.uid || !user.admin) {
      router.push("/signin");
    }
  }, [user]);

  return { user };
};
