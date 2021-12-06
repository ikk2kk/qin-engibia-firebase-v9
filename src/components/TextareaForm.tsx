import { UseFormRegisterReturn } from "react-hook-form";
import { forwardRef } from "react";
import TextareaAutosize from "react-textarea-autosize";

type Props = UseFormRegisterReturn & {
  label: string;
  error?: string;
  placeholder?: string;
};

export const TextareaForm = forwardRef<HTMLTextAreaElement, Props>(
  (props, ref) => {
    return (
      <div className="block">
        <label htmlFor={props.name}>
          <div className="block ml-4 text-sm font-bold text-gray-500">
            {props.label}
          </div>
          <div className="relative">
            <TextareaAutosize
              ref={ref}
              id={props.name}
              style={{ caretColor: "#3B82F6" }}
              minRows={3}
              className="rounded-sm resize-none input focus-primary w-full text-xl bg-gray-100 border-none p-3 outline-none"
              autoComplete="off"
              placeholder={props.placeholder}
              name={props.name}
              onChange={props.onChange}
              onBlur={props.onBlur}
            />
          </div>
        </label>
        {props.error ? (
          <p className="mt-0.5 ml-4  text-red-500">{props.error}</p>
        ) : null}
      </div>
    );
  }
);
