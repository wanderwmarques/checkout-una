import * as React from "react"
import { cn } from "@/lib/utils"

const MoneyInput = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <div className="relative">
        <input
          type={type}
          className={cn(
            "flex h-16 w-full rounded-md border border-input bg-background px-3 py-2 !text-[1.5rem] font-bold text-center ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:placeholder:text-muted-foreground enabled:bg-background enabled:text-foreground enabled:placeholder:text-foreground transition-colors",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
MoneyInput.displayName = "MoneyInput"

export { MoneyInput }
