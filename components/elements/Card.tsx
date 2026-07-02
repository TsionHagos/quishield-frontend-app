import * as React from "react"

import {
  Card as ShadcnCard,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Image } from "./Image"
import { Typography } from "./Typography"

export interface CardProps extends React.ComponentProps<typeof ShadcnCard> {
  image?: string
  title?: string
  subtitle?: string
  tags?: string[]
}

function Card({
  image,
  title,
  subtitle,
  tags,
  className,
  ...props
}: CardProps) {
  return (
    <ShadcnCard
      className={cn("overflow-hidden pt-0", className)}
      {...props}
    >
      {image ? (
        <Image
          src={image}
          alt={title ?? ""}
          objectFit="cover"
          width={600}
          height={300}
          className="h-48 w-full rounded-none"
        />
      ) : null}

      <CardHeader>
        {title ? <Typography variant="h5" text={title} /> : null}
        {subtitle ? (
          <Typography
            variant="body2"
            text={subtitle}
            className="text-muted-foreground"
          />
        ) : null}
      </CardHeader>

      {tags && tags.length > 0 ? (
        <CardContent className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <Badge key={`${tag}-${index}`} variant="secondary">
              {tag}
            </Badge>
          ))}
        </CardContent>
      ) : null}
    </ShadcnCard>
  )
}

export { Card }
