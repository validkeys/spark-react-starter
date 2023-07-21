import { DOMRectProps } from "@/types"

export const createDomRect = (): DOMRectProps => {
  const rect = new DOMRect()
  return rect.toJSON() as DOMRectProps
}

export const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ")
}
