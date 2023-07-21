import { NavigationItem } from "@/types"
import { SubNavBar } from "../navs/SubNavBar"
import { ReactNode } from "react"

export const SubNav = ({
  items,
  extras,
}: {
  items: NavigationItem[]
  extras?: () => ReactNode
}) => {
  return (
    <div className="spark-container">
      <div className="py-3">
        <SubNavBar items={items} extras={extras} />
      </div>
    </div>
  )
}
