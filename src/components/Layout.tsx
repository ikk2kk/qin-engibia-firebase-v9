import { ReactNode, VFC } from "react";
import { Header } from "./Header";

type Props = {
  page?: string;
  children: ReactNode;
};

export const Layout: VFC<Props> = (props) => {
  return (
    <div className=" h-screen flex">
      <Header className="fixed bg-gray-100 w-full h-16 border-b border-gray-300 z-10" />

      <main className="bg-gray-300 flex-1">
        {/* <div className="flex justify-center w-full bg-gray-200">
          <div className=" pt-16 h-screen bg-gray-200 flex flex-col items-center w-full sm:max-w-2xl"> */}
        {props.children}
        {/* </div>
        </div> */}
      </main>
    </div>
  );
};
