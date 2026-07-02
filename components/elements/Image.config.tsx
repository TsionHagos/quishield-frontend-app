import type { ElementConfig } from "./types"

export const ImageConfig: ElementConfig = {
  Image: {
    label: "Image",
    fields: {
      src: {
        type: "image",
        label: "Source URL",
      },
      alt: {
        type: "text",
        label: "Alt Text",
      },
      objectFit: {
        type: "select",
        label: "Object Fit",
        options: [
          { label: "Cover", value: "cover" },
          { label: "Contain", value: "contain" },
          { label: "Fill", value: "fill" },
          { label: "None", value: "none" },
          { label: "Scale Down", value: "scale-down" },
        ],
      },
      circle: {
        type: "boolean",
        label: "Circle",
      },
      width: {
        type: "number",
        label: "Width",
      },
      height: {
        type: "number",
        label: "Height",
      },
    },
  },
}

export default ImageConfig
