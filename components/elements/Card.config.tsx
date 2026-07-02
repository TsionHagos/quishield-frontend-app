import type { ElementConfig } from "./types"

export const CardConfig: ElementConfig = {
  Card: {
    label: "Card",
    fields: {
      image: {
        type: "text",
        label: "Image URL",
      },
      title: {
        type: "text",
        label: "Title",
      },
      subtitle: {
        type: "text",
        label: "Subtitle",
      },
      tags: {
        type: "tags",
        label: "Tags",
      },
    },
  },
}

export default CardConfig
