import * as React from "react"
import NextImage from "next/image"

import { cn } from "@/lib/utils"

export type ObjectFit =
  | "contain"
  | "cover"
  | "fill"
  | "none"
  | "scale-down"

const objectFitStyles: Record<ObjectFit, string> = {
  contain: "object-contain",
  cover: "object-cover",
  fill: "object-fill",
  none: "object-none",
  "scale-down": "object-scale-down",
}

export interface ImageProps {
  src: string
  alt?: string
  objectFit?: ObjectFit
  circle?: boolean
  height?: number
  width?: number
  className?: string
}

function Image({
  src,
  alt = "",
  objectFit = "cover",
  circle = false,
  height = 300,
  width = 300,
  className,
}: ImageProps) {
  return (
    <span className="inline-block">
      <NextImage
        src={src}
        alt={alt}
        height={height}
        width={width}
        className={cn(
          objectFitStyles[objectFit],
          circle ? "rounded-full" : "rounded-md",
          className
        )}
      />
    </span>
  )
}

export { Image }
