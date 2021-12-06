import React, { ReactNode, VFC } from "react";
import { useDroppable } from "@dnd-kit/core";

type Props = {
  id: string;
  children: ReactNode;
};

export const Droppable: VFC<Props> = (props) => {
  const { setNodeRef } = useDroppable({
    id: props.id,
  });
  return (
    <div ref={setNodeRef}>
      <div className="w-full">{props.children}</div>
    </div>
  );
};
