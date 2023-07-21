import { Fragment, ReactNode, Ref, forwardRef } from "react"
import { Disclosure, Menu, Transition } from "@headlessui/react"
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { useCurrentOrganization, useLogout, useSession } from "@/state"
import { Link, NavLink, useLocation } from "react-router-dom"
import { NavigationItem } from "@/types"
import { classNames } from "@/utils/dom"

type UserNavigationItem = {
  name: string
  href?: string
  action?: (e: unknown) => void
}

const noop = function () {}

type Props = {
  items: NavigationItem[]
  extras?: () => ReactNode
}

const CompanyLogo = () => {
  const { data } = useCurrentOrganization()
  const logoSrc =
    data && data.organization.logo
      ? data.organization.logo
      : "https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
  return (
    <Link to="/" className="flex flex-shrink-0 items-center">
      <img className="block h-8 w-auto" src={logoSrc} alt="Your Company" />
    </Link>
  )
}

const UserMenuNavigation = forwardRef(
  (
    { type }: { type: "mobile" | "desktop" },
    ref: Ref<HTMLButtonElement | HTMLDivElement>
  ) => {
    const logout = useLogout()

    const onLogoutClicked = function () {
      void logout.mutate()
    }

    const userNavigation: UserNavigationItem[] = [
      { name: "Your Profile", href: "#" },
      { name: "Settings", href: "#" },
      { name: "Sign out", action: onLogoutClicked },
    ]

    return type === "desktop" ? (
      <Menu.Items
        ref={ref}
        className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      >
        {userNavigation.map((item, idx) => (
          <Menu.Item key={`${item.name}.${idx}`}>
            {({ active }) => {
              const $classes = classNames(
                active ? "bg-gray-100" : "",
                "block px-4 py-2 text-sm text-gray-700"
              )
              return item.href ? (
                <Link to={item.href} className={$classes}>
                  {item.name}
                </Link>
              ) : (
                <span
                  className={`${$classes} cursor-pointer`}
                  onClick={item.action}
                >
                  {item.name}
                </span>
              )
            }}
          </Menu.Item>
        ))}
      </Menu.Items>
    ) : (
      userNavigation.map((item, idx) => (
        <Disclosure.Button
          key={`${item.name}.${idx}`}
          as={item.href ? "a" : "span"}
          className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
          ref={ref}
          {...(item.href ? { href: item.href } : { onClick: item.action })}
        >
          {item.name}
        </Disclosure.Button>
      ))
    )
  }
)

const NavigationItems = ({
  type,
  navigationItems,
}: {
  type: "mobile" | "desktop"
  navigationItems: NavigationItem[]
}) => {
  const location = useLocation()
  const { pathname } = location

  return type === "desktop" ? (
    <div className="flex items-center">
      <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
        {navigationItems.map((item, idx) => (
          <NavLink
            key={`${item.name}.${idx}`}
            to={item.href}
            className={({ isActive }) => {
              return classNames(
                isActive
                  ? "border-b-accent-content text-primary-content bg-primary"
                  : "border-b-transparent text-base-content",
                " inline-flex items-center border-b-2 py-1 px-2 rounded text-sm font-medium"
              )
            }}
            end={item.end}
          >
            {item.name}
          </NavLink>
        ))}
      </div>
    </div>
  ) : (
    <div className="space-y-1 pb-3 pt-2">
      {navigationItems.map((item, idx) => (
        <Disclosure.Button
          key={`${item.name}.${idx}`}
          as="a"
          href={item.href}
          className={classNames(
            item.href === pathname
              ? "border-indigo-500 bg-indigo-50 text-indigo-700"
              : "border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800",
            "block border-l-4 py-2 pl-3 pr-4 text-base font-medium"
          )}
          aria-current={item.href === pathname ? "page" : undefined}
        >
          {item.name}
        </Disclosure.Button>
      ))}
    </div>
  )
}

export const NavBar = ({ items, extras }: Props) => {
  const { data: session, isAuthenticated } = useSession()
  const navigationItems = items || []

  return (
    <Disclosure as="nav" className="bg-base-100 text-base-300">
      {({ open }) => (
        <>
          <div className="spark-container">
            <div className="flex h-16 justify-between">
              <div className="flex">
                {/* LOGO */}

                <CompanyLogo />

                {/* LARGE NAV ITEMS */}
                <NavigationItems
                  navigationItems={navigationItems}
                  type="desktop"
                />
              </div>

              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                {extras && <div className="mr-3">{extras()}</div>}

                {/* NOTIFICATIONS */}
                <button
                  type="button"
                  className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-8 w-8 rounded-full"
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt=""
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <UserMenuNavigation type="desktop" />
                  </Transition>
                </Menu>
              </div>

              {/* MOBILE NAV BUTTON */}
              <div className="-mr-2 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          {/* MOBILE NAV */}
          <Disclosure.Panel className="sm:hidden">
            <NavigationItems type="mobile" navigationItems={navigationItems} />
            <div className="border-t border-gray-200 pb-3 pt-4">
              {isAuthenticated && (
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <img
                      className="h-10 w-10 rounded-full"
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt=""
                    />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800 bg-red-500">
                      {session?.user.name}
                    </div>
                    <div className="text-sm font-medium text-gray-500">
                      {session?.user.email}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="ml-auto flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
              )}

              <div className="mt-3 space-y-1">
                <UserMenuNavigation type="mobile" />
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
