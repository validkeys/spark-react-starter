import { NavigationItem } from "@/types"
import { ReactNode } from "react"
import { NavLink } from "react-router-dom"
import { classNames } from "@/utils/dom"

export const SubNavBar = ({
  items,
  extras,
}: {
  items: NavigationItem[]
  extras?: () => ReactNode
}) => {
  return (
    <div className="flex flex-row justify-between">
      <nav className="-mb-px flex space-x-8 py-2" aria-label="Tabs">
        {items.map((item) => {
          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) => {
                return classNames(
                  isActive
                    ? "border-accent text-accent"
                    : "border-transparent text-gray-500",
                  "hover:border-secondary hover:text-secondary group inline-flex items-center border-b-2 pb-2 px-1 text-sm font-medium"
                )
              }}
              end={item.end}
            >
              <span>{item.name}</span>
            </NavLink>
          )
        })}
      </nav>

      {extras && <div>{extras()}</div>}
    </div>
  )
}
