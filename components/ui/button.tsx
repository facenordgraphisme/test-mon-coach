import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-xs font-medium uppercase tracking-wider transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive active:scale-[0.98] hover:shadow-md ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-stone-900 text-white hover:bg-stone-800 border border-stone-800/50 shadow-[0_2px_8px_0_rgba(0,0,0,0.08)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] hover:-translate-y-[1px]",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border border-stone-300 bg-transparent hover:bg-stone-50 hover:text-stone-900 shadow-sm",
        secondary:
          "bg-white text-stone-900 hover:bg-stone-50 border border-stone-200 shadow-sm hover:border-stone-300",
        ghost:
          "hover:bg-stone-100 hover:text-stone-900 shadow-none hover:shadow-none hover:translate-y-0",
        link: "text-primary underline-offset-4 hover:underline shadow-none hover:shadow-none hover:translate-y-0",
      },
      size: {
        default: "h-11 px-6 py-2 has-[>svg]:px-4",
        sm: "h-9 rounded-md px-3 has-[>svg]:px-2.5 text-[10px]",
        lg: "h-12 rounded-md px-8 text-sm has-[>svg]:px-6",
        icon: "size-10 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
