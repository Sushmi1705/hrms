import * as React from "react"
import { cn } from "@/lib/utils"
const Accordion = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & {type?: string, collapsible?: boolean}>(({ className, ...props }, ref) => (<div ref={ref} className={className} {...props} />))
const AccordionItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & {value: string}>(({ className, ...props }, ref) => (<div ref={ref} className={cn("border-b", className)} {...props} />))
const AccordionTrigger = React.forwardRef<HTMLButtonElement, React.HTMLAttributes<HTMLButtonElement>>(({ className, ...props }, ref) => (<button ref={ref} className={cn("flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline", className)} {...props} />))
const AccordionContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (<div ref={ref} className={cn("pb-4 pt-0 text-sm", className)} {...props} />))
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
