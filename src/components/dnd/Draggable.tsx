import React, { ReactNode, VFC } from "react";
import { useDraggable } from "@dnd-kit/core";

type Props = {
  id: string;
  children: ReactNode;
};

export const Draggable: VFC<Props> = (props) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: props.id,
  });

  return (
    <div ref={setNodeRef} {...listeners} {...attributes}>
      {props.children}
    </div>
  );
};
