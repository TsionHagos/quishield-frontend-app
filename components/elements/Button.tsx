import * as React from "react"

import {
  Button as ShadcnButton,
  type buttonVariants,
} from "@/components/ui/button"
import type { VariantProps } from "class-variance-authority"

export type ButtonVariant = NonNullable<
  VariantProps<typeof buttonVariants>["variant"]
>
export type ButtonSize = NonNullable<
  VariantProps<typeof buttonVariants>["size"]
>

export interface ButtonProps
  extends React.ComponentProps<typeof ShadcnButton> {
  variant?: ButtonVariant
  size?: ButtonSize
}

function Button({ variant = "default", size = "default", ...props }: ButtonProps) {
  return (
    <span className="inline-block">
      <ShadcnButton variant={variant} size={size} {...props} />
    </span>
  )
}

export { Button }
