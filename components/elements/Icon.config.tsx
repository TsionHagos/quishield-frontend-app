import type { ElementConfig } from "./types"

export const IconConfig: ElementConfig = {
  Icon: {
    label: "Icon",
    fields: {
      name: {
        type: "icon",
        label: "Icon",
      },
      size: {
        type: "text",
        label: "Size",
      },
      className: {
        type: "text",
        label: "Class Name",
      },
    },
  },
}

export default IconConfig
