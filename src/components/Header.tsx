import { VFC } from "react";
import {
  MenuIcon,
  InformationCircleIcon,
  LogoutIcon,
} from "@heroicons/react/outline";
import { Button } from "./Button";
import { auth } from "../firebase";
import Link from "next/link";
type Props = {
  className?: string;
};

export const Header: VFC<Props> = (props) => {
  return (
    <header className={props.className}>
      <div className="h-full flex items-center px-6">
        <div className="flex-1 flex space-x-1 items-center">
          <img src="/img/logo.png" alt="logo" width={32} height={34} />
          <h2 className="text-blue-700 font-bold text-xl">
            <Link href="/">エンジビアの泉</Link>
          </h2>
        </div>
        <Button
          variant="solid-gray"
          className="h-12 w-12 rounded-full"
          onClick={() => auth.signOut()}
        >
          <LogoutIcon className="h-7 w-7 text-gray-800" />
        </Button>
      </div>
    </header>
  );
};
