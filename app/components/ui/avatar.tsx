import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { mergeTailwind } from "~/lib/utils"

const Avatar =({ className, ref, ...props }: React.ComponentPropsWithRef<typeof AvatarPrimitive.Root>) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={mergeTailwind(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
)
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = ({ className, ref, ...props }: React.ComponentPropsWithRef<typeof AvatarPrimitive.Image>) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={mergeTailwind("aspect-square h-full w-full", className)}
    {...props}
  />
)
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = ({ className, ref, ...props }: React.ComponentPropsWithRef<typeof AvatarPrimitive.Fallback>) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={mergeTailwind(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
)
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }