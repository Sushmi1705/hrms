import * as React from "react"
import { cn } from "@/lib/utils"

export const Sheet = ({ children, open, onOpenChange }: any) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex justify-end">
      <div className="bg-white dark:bg-slate-900 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <button onClick={() => onOpenChange(false)} className="absolute top-4 right-4 text-slate-500 hover:text-slate-900 dark:hover:text-white z-50">✕</button>
        {children}
      </div>
    </div>
  )
}
export const SheetContent = ({ children, className }: any) => <div className={cn("flex-1 overflow-y-auto p-6", className)}>{children}</div>
export const SheetHeader = ({ children }: any) => <div className="p-6 border-b border-slate-200 dark:border-slate-800">{children}</div>
export const SheetTitle = ({ children }: any) => <h2 className="text-lg font-semibold">{children}</h2>
