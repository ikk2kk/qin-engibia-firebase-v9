import clsx from "clsx";
import type { LinkProps } from "next/link";
import Link from "next/link";
import type { DOMAttributes, ReactNode } from "react";
import { forwardRef, useMemo } from "react";

type Common = {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  variant?:
    | "outline"
    | "ghost"
    | "solid-blue"
    | "solid-lightblue"
    | "solid-red"
    | "solid-orange"
    | "solid-green"
    | "solid-gray"
    | "solid-white"
    | "solid-black";
};

type Button = Common & {
  onClick?: DOMAttributes<HTMLButtonElement>["onClick"];
};

type Link = Common & { linkProps: LinkProps };

const isLink = (props: Button | Link): props is Link => {
  return "linkProps" in props;
};

export const Button = forwardRef<
  HTMLButtonElement & HTMLAnchorElement,
  Button | Link
>((props, ref) => {
  const className = useMemo(() => {
    return clsx(
      "grid place-items-center focus-visible:ring-2 transition duration-200 ease-in-out focus:outline-none",
      {
        "hover:text-blue-400 border focus:ring-2 focus:ring-blue-400":
          props.variant === "outline",
        "hover:text-blue-400 focus-visible:text-blue-400 hover:bg-blue-50 focus-visible:bg-blue-50 focus-visible:ring-blue-400":
          props.variant === "ghost",
        "text-white bg-blue-500 hover:bg-blue-600 focus-visible:bg-blue-600 focus-visible:ring-blue-400":
          props.variant === "solid-blue",
        "text-white bg-red-500 hover:bg-red-600 focus-visible:bg-red-600 focus-visible:ring-red-400":
          props.variant === "solid-red",
        // "text-white bg-orange-500 hover:bg-orange-600 focus-visible:bg-orange-600 focus-visible:ring-orange-400":
        //   props.variant === "solid-orange",
        "text-orange-500 bg-orange-200 hover:bg-orange-300 focus-visible:bg-orange-300 focus-visible:ring-orange-300":
          props.variant === "solid-orange",
        "text-green-700 bg-green-200 hover:bg-green-300 focus-visible:bg-green-300 focus-visible:ring-green-300":
          props.variant === "solid-green",
        "bg-gray-100 hover:bg-gray-200 focus-visible:bg-gray-200 focus-visible:ring-blue-400":
          props.variant === "solid-gray",
        "bg-white hover:bg-gray-100 focus:bg-gray-100":
          props.variant === "solid-white",
        "text-white bg-black hover:bg-gray-800 focus:bg-gray-800":
          props.variant === "solid-black",
        "text-blue-500 bg-blue-200 hover:bg-blue-300 focus-visible:bg-blue-300 focus-visible:ring-blue-100":
          props.variant === "solid-lightblue",
      },
      props.className
    );
  }, [props.className, props.variant]);

  if (isLink(props)) {
    return (
      <Link {...props.linkProps}>
        <a ref={ref} className={className}>
          {props.children}
        </a>
      </Link>
    );
  }
  return (
    <button
      type="button"
      ref={ref}
      onClick={props.onClick}
      className={className}
    >
      {props.children}
    </button>
  );
});

Button.displayName === "Button";
