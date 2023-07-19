import { ReactNode, useEffect } from "react"

type Props = {
  theme: string
  children: ReactNode
}

export const DaisyTheme = ({ theme, children }: Props) => {
  useEffect(() => {
    const $html = document.getElementsByTagName("html")[0]
    $html.setAttribute("data-theme", theme || "light")
  }, [theme])
  return children
}
