import * as React from "react"
import { DynamicIcon, type IconName } from "lucide-react/dynamic"

import { cn } from "@/lib/utils"

export interface IconProps
  extends Omit<React.ComponentProps<typeof DynamicIcon>, "name"> {
  name: IconName
  size?: number
  className?: string
}

function Icon({ name, size = 24, className, ...props }: IconProps) {
  return (
    <DynamicIcon
      name={name}
      size={size}
      className={cn(className)}
      {...props}
    />
  )
}

export { Icon }
export type { IconName }
