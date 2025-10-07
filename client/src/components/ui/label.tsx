/**
 * @fileoverview This file defines the Label component, a standard UI element.
 * This component is based on the shadcn/ui library for labeling form elements.
 * It is styled using Tailwind CSS and built with Radix UI for accessibility and functionality.
 */
/**
 * @fileoverview This file defines the Label component, a standard UI element.
 * This component is based on the shadcn/ui library for labeling form elements.
 * It is styled using Tailwind CSS and built with Radix UI for accessibility and functionality.
 */
import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
