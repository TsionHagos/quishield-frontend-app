import * as React from "react"

import { cn } from "@/lib/utils"

export type TypographyVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "body1"
  | "body2"
  | "caption"

export type TypographyAlign = "left" | "center" | "right" | "justify"

export type TypographyWeight =
  | "thin"
  | "extralight"
  | "light"
  | "normal"
  | "medium"
  | "semibold"
  | "bold"
  | "extrabold"
  | "black"

const variantStyles: Record<TypographyVariant, string> = {
  h1: "font-heading scroll-m-20 text-4xl tracking-tight text-balance lg:text-5xl",
  h2: "font-heading scroll-m-20 text-3xl tracking-tight",
  h3: "font-heading scroll-m-20 text-2xl tracking-tight",
  h4: "font-heading scroll-m-20 text-xl tracking-tight",
  h5: "font-heading scroll-m-20 text-lg tracking-tight",
  h6: "font-heading scroll-m-20 text-base tracking-tight",
  body1: "leading-7 text-base",
  body2: "leading-6 text-sm",
  caption: "text-xs text-muted-foreground",
}

const variantElement: Record<TypographyVariant, React.ElementType> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  body1: "p",
  body2: "p",
  caption: "span",
}

const weightStyles: Record<TypographyWeight, string> = {
  thin: "font-thin",
  extralight: "font-extralight",
  light: "font-light",
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
  extrabold: "font-extrabold",
  black: "font-black",
}

const alignStyles: Record<TypographyAlign, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
  justify: "text-justify",
}

const defaultWeight: Record<TypographyVariant, TypographyWeight> = {
  h1: "bold",
  h2: "bold",
  h3: "bold",
  h4: "bold",
  h5: "bold",
  h6: "bold",
  body1: "normal",
  body2: "normal",
  caption: "normal",
}

export interface TypographyProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "children"> {
  text?: React.ReactNode
  variant?: TypographyVariant
  textAlign?: TypographyAlign
  fontWeight?: TypographyWeight
  className?: string
}

function Typography({
  text,
  variant = "body1",
  textAlign,
  fontWeight,
  className,
  ...props
}: TypographyProps) {
  const Comp = variantElement[variant]

  return (
    <Comp
      data-variant={variant}
      className={cn(
        variantStyles[variant],
        weightStyles[fontWeight ?? defaultWeight[variant]],
        textAlign && alignStyles[textAlign],
        className
      )}
      {...props}
    >
      {text}
    </Comp>
  )
}

export { Typography }
