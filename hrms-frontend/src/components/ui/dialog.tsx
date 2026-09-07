import * as React from "react"
import { cn } from "@/lib/utils"

export const Dialog = ({ children, open, onOpenChange }: any) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-2xl w-full max-w-sm animate-in zoom-in-95 duration-200">
        <div className="p-6">{children}</div>
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
          <button onClick={() => onOpenChange(false)} className="px-4 py-2 text-sm text-slate-500 hover:bg-slate-100 rounded-md">Cancel</button>
          <button onClick={() => onOpenChange('confirm')} className="px-4 py-2 text-sm bg-red-600 text-white hover:bg-red-700 rounded-md">Confirm</button>
        </div>
      </div>
    </div>
  )
}
export const DialogTitle = ({ children }: any) => <h2 className="text-lg font-semibold mb-2">{children}</h2>
export const DialogDescription = ({ children }: any) => <p className="text-sm text-slate-500">{children}</p>
