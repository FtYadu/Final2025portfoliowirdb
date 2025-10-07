/**
 * @fileoverview This file defines the Skeleton component, a standard UI element.
 * This component is based on the shadcn/ui library for showing a placeholder loading state.
 * It is styled using Tailwind CSS for visual presentation.
 */
/**
 * @fileoverview This file defines the Skeleton component, a standard UI element.
 * This component is based on the shadcn/ui library for showing a placeholder loading state.
 * It is styled using Tailwind CSS for visual presentation.
 */
import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }
