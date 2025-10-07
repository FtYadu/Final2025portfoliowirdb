/**
 * @fileoverview This file defines the Textarea component, a standard UI element.
 * This component is based on the shadcn/ui library for multi-line text input.
 * It is styled using Tailwind CSS for visual presentation.
 */
/**
 * @fileoverview This file defines the Textarea component, a standard UI element.
 * This component is based on the shadcn/ui library for multi-line text input.
 * It is styled using Tailwind CSS for visual presentation.
 */
import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
