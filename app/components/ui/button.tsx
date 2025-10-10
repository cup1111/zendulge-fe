import React from "react"
import { mergeTailwind } from "~/lib/utils";

interface ButtonProps extends React.ComponentPropsWithRef<'button'> {
  variant?: "default" | "ghost";
  size?: "default" | "sm";
  asChild?: boolean;
}

const Button = ({ ref, className, variant = "default", size = "default", asChild, children, ...props }: ButtonProps) => {
    const Comp = asChild ? "span" : "button";
    return (
      <Comp
        className={mergeTailwind(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          variant === "default" &&
            "bg-shadow-lavender text-white hover:opacity-90 px-4 py-2",
          variant === "ghost" &&
            "hover:bg-gray-100 hover:text-gray-900 px-4 py-2",
          size === "sm" && "h-8 px-3 text-sm",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    );
  }

Button.displayName = "Button";

export { Button };