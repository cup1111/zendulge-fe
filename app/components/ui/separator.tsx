import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"
import { combineClasses } from "~/lib/utils"

const Separator = ({ className, orientation = "horizontal", decorative = true, ref, ...props }: React.ComponentPropsWithRef<typeof SeparatorPrimitive.Root>) => (
  <SeparatorPrimitive.Root
    ref={ref}
    decorative={decorative}
    orientation={orientation}
    className={combineClasses(
      "shrink-0 bg-border",
      orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
      className
    )}
    {...props}
  />
)
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }