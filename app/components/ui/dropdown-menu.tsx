import React from "react"
import { mergeTailwind } from "~/lib/utils";

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);
  
  return (
    <div className="relative inline-block" onMouseLeave={() => setIsOpen(false)}>
      {React.Children.map(children, child =>
        React.isValidElement(child)
          ? React.cloneElement(child as any, { isOpen, setIsOpen })
          : child
      )}
    </div>
  );
}

export function DropdownMenuTrigger({ children, asChild, isOpen, setIsOpen }: any) {
  return (
    <div
      onMouseEnter={() => setIsOpen(true)}
      onClick={() => setIsOpen(!isOpen)}
      className="cursor-pointer"
    >
      {children}
    </div>
  );
}

export function DropdownMenuContent({ children, align = "center", className, isOpen }: any) {
  if (!isOpen) return null;
  
  return (
    <div
      className={mergeTailwind(
        "absolute z-50 min-w-[200px] rounded-md border bg-white p-1 shadow-md",
        align === "center" && "left-1/2 -translate-x-1/2",
        align === "end" && "right-0",
        align === "start" && "left-0",
        className
      )}
    >
      {children}
    </div>
  );
}

export function DropdownMenuItem({ children, asChild, onClick, className }: any) {
  return (
    <div
      className={mergeTailwind(
        "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
        "hover:bg-gray-100 transition-colors",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}