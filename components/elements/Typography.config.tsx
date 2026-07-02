import type { ElementConfig } from "./types"

export const TypographyConfig: ElementConfig = {
  Typography: {
    label: "Typography",
    fields: {
      text: {
        type: "textarea",
        label: "Text",
      },
      variant: {
        type: "select",
        label: "Variant",
        options: [
          { label: "Heading 1", value: "h1" },
          { label: "Heading 2", value: "h2" },
          { label: "Heading 3", value: "h3" },
          { label: "Heading 4", value: "h4" },
          { label: "Heading 5", value: "h5" },
          { label: "Heading 6", value: "h6" },
          { label: "Body 1", value: "body1" },
          { label: "Body 2", value: "body2" },
          { label: "Caption", value: "caption" },
        ],
      },
      textAlign: {
        type: "select",
        label: "Text Align",
        options: [
          { label: "Left", value: "left" },
          { label: "Center", value: "center" },
          { label: "Right", value: "right" },
          { label: "Justify", value: "justify" },
        ],
      },
      fontWeight: {
        type: "select",
        label: "Font Weight",
        options: [
          { label: "Thin", value: "thin" },
          { label: "Extra Light", value: "extralight" },
          { label: "Light", value: "light" },
          { label: "Normal", value: "normal" },
          { label: "Medium", value: "medium" },
          { label: "Semibold", value: "semibold" },
          { label: "Bold", value: "bold" },
          { label: "Extra Bold", value: "extrabold" },
          { label: "Black", value: "black" },
        ],
      },
      className: {
        type: "text",
        label: "Class Name",
      },
    },
  },
}

export default TypographyConfig
