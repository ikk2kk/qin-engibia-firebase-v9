import { VFC } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { COMMENT } from "../types/types";
import clsx from "clsx";

type Props = {
  comment: COMMENT;
  result?: true;
  resultIndex?: number;
};

export const CommentCard: VFC<Props> = (props) => {
  return (
    <div className="mt-4 w-full p-3 bg-gray-100 flex flex-col justify-between">
      {props.result ? (
        <div className="flex justify-center">
          <h3 className="text-xl font-bold text-blue-500">
            エンジビア{props.resultIndex}
          </h3>
        </div>
      ) : null}
      <label htmlFor="comment" className="bg-gray-100 flex-1 cursor-text">
        <TextareaAutosize
          id="comment"
          style={{ caretColor: "#3B82F6" }}
          // className="w-full bg-gray-100 h-full border-none py-3 resize-none  outline-none"
          className={clsx(
            "w-full bg-gray-100 h-full border-none py-3 resize-none  outline-none",
            { "text-3xl": props.result }
          )}
          value={props.comment.comment}
          placeholder="エンジビアを入力する"
          autoComplete="off"
          disabled
        />
      </label>

      <div className="flex items-center justify-between">
        <div className="flex-1 flex items-center">
          <img
            className="w-8 h-8 rounded-full"
            src={props.comment.avatar}
            alt="user"
          />
          <span className="block ml-2 text-sm text-gray-500">
            {props.comment.username}
          </span>
        </div>
        {props.result ? (
          <div className="bg-yellow-100 p-3 flex items-end rounded-t-sm">
            <span className="text-blue-500 text-4xl font-bold">
              {/* {votingComment.ecount} */}
              {props.comment.ecount}
            </span>
            <span className="text-blue-500">へぇ</span>
          </div>
        ) : props.comment.cstate === "フィーチャー後" ? (
          <div className="text-gray-500">{props.comment.ecount}へぇ</div>
        ) : null}
        {/* {props.comment.cstate === "フィーチャー後" ? (
          <div className="text-gray-500">{props.comment.ecount}へぇ</div>
        ) : null} */}
      </div>
    </div>
  );
};
