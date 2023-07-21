import { Menu, Transition } from "@headlessui/react"
import { Fragment, ReactNode } from "react"
import {
  CurrencyDollarIcon,
  CalendarIcon,
  SparklesIcon,
  TrophyIcon,
} from "@heroicons/react/20/solid"
import { classNames } from "@/utils/dom"

type MenuItem = {
  icon: typeof CurrencyDollarIcon
  title: string
  description: string
}

const menuItems: MenuItem[] = [
  {
    icon: CurrencyDollarIcon,
    title: "Money Movement",
    description: "Move money in, out, or between investment accounts.",
  },
  {
    icon: TrophyIcon,
    title: "RIF/LIF",
    description: "Set up or adjust RIF and LIF payments.",
  },
  {
    icon: CalendarIcon,
    title: "DRIP",
    description: "Set up or adjust dividend reinvestment.",
  },
  {
    icon: SparklesIcon,
    title: "New Account",
    description: "Add a new client account.",
  },
]

export const ActionsMenu = () => {
  const handleClick = (item: MenuItem) => {
    console.log("onClick", item)
  }

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="btn btn-secondary">Actions</Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-96 origin-top-right divide-y divide-base-300 rounded-md bg-base text-base-content shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {menuItems.map((item, idx) => (
            <div key={`actions.${idx}`} className="">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => handleClick(item)}
                    className={classNames(
                      active
                        ? "bg-primary text-primary-content"
                        : "hover:bg-primary hover:text-primary-content",
                      "flex cursor-pointer py-3 text-left w-full border-0"
                    )}
                  >
                    <div className="py-2 px-4">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-semibold">{item.title}</div>
                      <div className="text-sm opacity-75">
                        {item.description}
                      </div>
                    </div>
                  </button>
                )}
              </Menu.Item>
            </div>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
