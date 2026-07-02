export type FieldType =
  | "text"
  | "textarea"
  | "color"
  | "icon"
  | "array"
  | "object"
  | "boolean"
  | "select"
  | "image"
  | "number"
  | "tags"

export interface FieldOption {
  label: string
  value: string
}

export interface FieldConfig {
  type: FieldType
  label?: string
  options?: FieldOption[]
  arrayFields?: Record<string, FieldConfig>
  objectFields?: Record<string, FieldConfig>
}

export interface ComponentConfig {
  label: string
  fields: Record<string, FieldConfig>
}

export type ElementConfig = Record<string, ComponentConfig>
