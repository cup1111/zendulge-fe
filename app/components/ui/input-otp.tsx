import React from "react"
import { OTPInput, OTPInputContext } from "input-otp"
import { Dot } from "lucide-react"

import { combineClasses } from "~/lib/utils"

const InputOTP = ({ className, containerClassName, ref, ...props }: React.ComponentPropsWithRef<typeof OTPInput>) => (
  <OTPInput
    ref={ref}
    containerClassName={combineClasses(
      "flex items-center gap-2 has-[:disabled]:opacity-50",
      containerClassName
    )}
    className={combineClasses("disabled:cursor-not-allowed", className)}
    {...props}
  />
)
InputOTP.displayName = "InputOTP"

const InputOTPGroup = ({ className, ref, ...props }: React.ComponentPropsWithRef<"div">) => (
  <div ref={ref} className={combineClasses("flex items-center", className)} {...props} />
)
InputOTPGroup.displayName = "InputOTPGroup"

const InputOTPSlot = ({ index, className, ref, ...props }: React.ComponentPropsWithRef<"div"> & { index: number }) => {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index]

  return (
    <div
      ref={ref}
      className={combineClasses(
        "relative flex h-10 w-10 items-center justify-center border-y border-r border-input text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md",
        isActive && "z-10 ring-2 ring-ring ring-offset-background",
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      )}
    </div>
  )
}
InputOTPSlot.displayName = "InputOTPSlot"

const InputOTPSeparator = ({ ref, ...props }: React.ComponentPropsWithRef<"div">) => (
  <div ref={ref} role="separator" {...props}>
    <Dot />
  </div>
)
InputOTPSeparator.displayName = "InputOTPSeparator"

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
