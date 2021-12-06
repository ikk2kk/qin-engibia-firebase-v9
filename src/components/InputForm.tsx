// import type { InputHTMLAttributes } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { forwardRef } from "react";

// type InputProps = InputHTMLAttributes<HTMLInputElement> & {
//   label: string;
//   name: string;
//   prefix?: string;
//   error?: string;
// };

type Props = UseFormRegisterReturn & {
  label: string;
  error?: string;
  placeholder?: string;
  prefix?: string;
  type?: string;
};

export const InputForm = forwardRef<HTMLInputElement, Props>((props, ref) => {
  return (
    <div className="block">
      <label htmlFor={props.name}>
        <div className="block ml-4 text-sm font-bold text-gray-500">
          {props.label}
        </div>
        <div className="relative">
          {props.prefix ? (
            <span className="flex absolute left-5 items-center h-full font-bold">
              {props.prefix}
            </span>
          ) : null}
          <input
            ref={ref}
            type={props.type ? props.type : "text"}
            id={props.name}
            className={`py-6 pr-5 mt-0.5 w-full h-10 font-bold bg-gray-100 rounded-xl border-none focus:ring-2 focus:ring-blue-400 focus:outline-none ${
              props.prefix ? "pl-10" : "pl-5"
            }`}
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
});
InputForm.displayName = "InputForm"