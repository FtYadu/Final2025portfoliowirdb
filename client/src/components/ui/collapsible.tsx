/**
 * @fileoverview This file defines the Collapsible component, a standard UI element.
 * This component is based on the shadcn/ui library for content that can be expanded and collapsed.
 * It is styled using Tailwind CSS and built with Radix UI for accessibility and functionality.
 */
/**
 * @fileoverview This file defines the Collapsible component, a standard UI element.
 * This component is based on the shadcn/ui library for content that can be expanded and collapsed.
 * It is styled using Tailwind CSS and built with Radix UI for accessibility and functionality.
 */
"use client"

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

const Collapsible = CollapsiblePrimitive.Root

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger

const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
