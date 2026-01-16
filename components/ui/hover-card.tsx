import * as React from "react"
import { cn } from "@/lib/utils"

type Side = "top" | "right" | "bottom" | "left"
type Align = "start" | "center" | "end"

export interface HoverCardProps {
  trigger: React.ReactNode
  children: React.ReactNode
  className?: string
  side?: Side
  align?: Align
}

function positionClass(side: Side, align: Align) {
  if (side === "bottom") {
    if (align === "start") return "top-full left-0"
    if (align === "center") return "top-full left-1/2 -translate-x-1/2"
    return "top-full right-0"
  }
  if (side === "top") {
    if (align === "start") return "bottom-full left-0"
    if (align === "center") return "bottom-full left-1/2 -translate-x-1/2"
    return "bottom-full right-0"
  }
  if (side === "right") {
    if (align === "start") return "left-full top-0"
    if (align === "center") return "left-full top-1/2 -translate-y-1/2"
    return "left-full bottom-0"
  }
  if (align === "start") return "right-full top-0"
  if (align === "center") return "right-full top-1/2 -translate-y-1/2"
  return "right-full bottom-0"
}

export function HoverCard({ trigger, children, className, side = "bottom", align = "end" }: HoverCardProps) {
  return (
    <div className={cn("relative inline-block group", className)}>
      {trigger}
      <div
        className={cn(
          "absolute z-50 mt-2 rounded-md border bg-popover text-popover-foreground shadow-md p-2 opacity-0 pointer-events-none",
          "group-hover:opacity-100 group-hover:pointer-events-auto",
          positionClass(side, align)
        )}
      >
        {children}
      </div>
    </div>
  )
}

export default HoverCard