import { US, CA } from "country-flag-icons/react/3x2"

type Props = {
  countryCode?: string
  currencyCode?: "usd" | "cad"
}

const ByCurrency = {
  usd: US,
  cad: CA,
}

export const FlagIcon = (props: Props) => {
  let Component = null

  if (props.currencyCode) {
    const code = props.currencyCode.toLowerCase()
    Component = ByCurrency[code as keyof typeof ByCurrency]
  }

  return Component ? <Component /> : <CA />
}
