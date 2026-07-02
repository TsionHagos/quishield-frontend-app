import type { ElementConfig } from "./types"

export const ButtonConfig: ElementConfig = {
  Button: {
    label: "Button",
    fields: {
      children: {
        type: "text",
        label: "Label",
      },
      variant: {
        type: "select",
        label: "Variant",
        options: [
          { label: "Default", value: "default" },
          { label: "Destructive", value: "destructive" },
          { label: "Outline", value: "outline" },
          { label: "Secondary", value: "secondary" },
          { label: "Ghost", value: "ghost" },
          { label: "Link", value: "link" },
        ],
      },
      size: {
        type: "select",
        label: "Size",
        options: [
          { label: "Default", value: "default" },
          { label: "Extra Small", value: "xs" },
          { label: "Small", value: "sm" },
          { label: "Large", value: "lg" },
          { label: "Icon", value: "icon" },
        ],
      },
    },
  },
}

export default ButtonConfig
