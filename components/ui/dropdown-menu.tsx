import * as React from "react"
import { cn } from "@/lib/utils"

type Side = "top" | "right" | "bottom" | "left"
type Align = "start" | "center" | "end"

type MenuContextValue = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  rootRef: React.RefObject<HTMLDivElement>
}

const MenuContext = React.createContext<MenuContextValue | null>(null)

function useMenu() {
  const ctx = React.useContext(MenuContext)
  if (!ctx) throw new Error("DropdownMenu must be used within provider")
  return ctx
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

export function DropdownMenu({ children, className }: { children: React.ReactNode; className?: string }) {
  const [open, setOpen] = React.useState(false)
  const rootRef = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    function onDoc(e: Event) {
      const el = rootRef.current
      if (!el) return
      if (!el.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", onDoc)
    document.addEventListener("touchstart", onDoc)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onDoc)
      document.removeEventListener("touchstart", onDoc)
      document.removeEventListener("keydown", onKey)
    }
  }, [])
  return (
    <MenuContext.Provider value={{ open, setOpen, rootRef }}>
      <div ref={rootRef} className={cn("relative inline-block", className)}>{children}</div>
    </MenuContext.Provider>
  )
}

export function DropdownMenuTrigger({ children, asChild = false, className }: { children: React.ReactNode; asChild?: boolean; className?: string }) {
  const { setOpen } = useMenu()
  function onClick() {
    setOpen(v => !v)
  }
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement, { onClick, className: cn(className, (children as any).props?.className) })
  }
  return (
    <button onClick={onClick} className={cn("inline-flex", className)}>{children}</button>
  )
}

export function DropdownMenuContent({ children, side = "bottom", align = "end", className }: { children: React.ReactNode; side?: Side; align?: Align; className?: string }) {
  const { open } = useMenu()
  return (
    <div
      className={cn(
        "absolute z-50 mt-2 min-w-40 rounded-md border bg-popover text-popover-foreground shadow-md p-1",
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        positionClass(side, align),
        className
      )}
    >
      {children}
    </div>
  )
}

export function DropdownMenuItem({ children, onSelect, className }: { children: React.ReactNode; onSelect?: () => void; className?: string }) {
  const { setOpen } = useMenu()
  function onClick() {
    if (onSelect) onSelect()
    setOpen(false)
  }
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2 rounded-sm px-2 py-2 text-sm",
        "hover:bg-accent hover:text-accent-foreground",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        className
      )}
    >
      {children}
    </button>
  )
}

export function DropdownMenuSeparator({ className }: { className?: string }) {
  return <div className={cn("my-1 h-px w-full bg-border", className)} />
}

export default DropdownMenu