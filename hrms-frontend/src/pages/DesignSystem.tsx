import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { Check, X, Bell, ChevronRight, Settings, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function DesignSystem() {
  return (
    <div className="max-w-7xl mx-auto space-y-16 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Design System</h1>
        <p className="text-lg text-slate-500 mt-2">Enterprise-grade UI components and tokens.</p>
      </div>

      {/* Typography */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold border-b border-slate-200 dark:border-slate-800 pb-2">Typography</h2>
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Heading 1</h1>
            <p className="text-sm text-slate-500 mt-1">4xl/5xl • Extrabold • Tracking Tight</p>
          </div>
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">Heading 2</h2>
            <p className="text-sm text-slate-500 mt-1">3xl • Semibold • Tracking Tight</p>
          </div>
          <div>
            <h3 className="text-2xl font-semibold tracking-tight">Heading 3</h3>
            <p className="text-sm text-slate-500 mt-1">2xl • Semibold • Tracking Tight</p>
          </div>
          <div>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              Body paragraph: The quick brown fox jumps over the lazy dog. This text demonstrates the standard leading and spacing applied to base paragraph tags within the application.
            </p>
          </div>
        </div>
      </section>

      {/* Buttons */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold border-b border-slate-200 dark:border-slate-800 pb-2">Buttons</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button disabled>Disabled</Button>
          <Button>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Loading
          </Button>
          <Button className="rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
            Rounded Pill
          </Button>
        </div>
      </section>

      {/* Badges */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold border-b border-slate-200 dark:border-slate-800 pb-2">Badges</h2>
        <div className="flex flex-wrap gap-4">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400">Success</Badge>
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400">Warning</Badge>
        </div>
      </section>

      {/* Cards */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold border-b border-slate-200 dark:border-slate-800 pb-2">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Standard Card</CardTitle>
              <CardDescription>A standard enterprise data card.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Content goes here inside the main card body.</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Action</Button>
            </CardFooter>
          </Card>
          
          <Card className="glass relative overflow-hidden group hover:shadow-lg hover:shadow-primary/5 transition-all">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500">
              <Settings className="w-24 h-24" />
            </div>
            <CardHeader className="relative z-10">
              <CardTitle>Glass/Premium Card</CardTitle>
              <CardDescription>Hover over me to see effects.</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <p className="text-sm">Premium styling with subtle blurs, background gradients, and hover animations.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Interactions */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold border-b border-slate-200 dark:border-slate-800 pb-2">Interactions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-sm font-medium mb-4 text-slate-500">Accordion</h3>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Is it accessible?</AccordionTrigger>
                <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Is it styled?</AccordionTrigger>
                <AccordionContent>Yes. It comes with default styles that matches the other components.</AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-4 text-slate-500">Toasts & Feedback</h3>
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => toast.success("Record created successfully")}>
                Show Success Toast
              </Button>
              <Button variant="outline" onClick={() => toast.error("Failed to delete record")}>
                Show Error Toast
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Skeletons */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold border-b border-slate-200 dark:border-slate-800 pb-2">Loading States (Skeletons)</h2>
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </section>

    </div>
  );
}
