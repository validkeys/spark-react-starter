import { MagnifyingGlassIcon } from "@heroicons/react/20/solid"
import { useState, RefObject, useEffect, useRef } from "react"
import { clientSearchQuery, useClickAway, useRefPosition } from "@/state"
import { useQuery } from "@tanstack/react-query"
import { ClientSearchResults } from "@/types"
import { createPortal } from "react-dom"
import { Transition } from "@headlessui/react"

type SearchProps = {
  params: {
    organizationId: null | string
    advisorId: null | string
  }
}

const usePosition = (
  targetRef: RefObject<HTMLElement>,
  contentRef: RefObject<HTMLElement>
) => {
  const [positionsInitialized, setPositionsInitialized] = useState(false)
  const targetRects = useRefPosition(targetRef)
  const contentRects = useRefPosition(contentRef)
  const [contentPosition, setContentPosition] = useState({
    top: 0,
    left: 0,
  })

  useEffect(() => {
    if (contentRef.current) {
      const widthDiff = contentRects.width - targetRects.width
      setContentPosition({
        top: targetRects.bottom + 10,
        left: targetRects.left - widthDiff,
      })
      setPositionsInitialized(true)
    }
  }, [targetRects, contentRects, contentRef])

  return { ...contentPosition, ready: positionsInitialized }
}

const SearchResults = ({
  tetherRef,
  contentRef,
  results,
}: {
  tetherRef: RefObject<HTMLElement>
  contentRef: RefObject<HTMLDivElement>
  results: ClientSearchResults | null | undefined
}) => {
  const { ready, ...position } = usePosition(tetherRef, contentRef)

  return (
    <div ref={contentRef} className={`fixed`} style={position}>
      <Transition
        show={ready}
        enter="transition-opacity duration-75"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="p-5 bg-base-300 shadow-lg text-base w-[300px] h-80 overflow-auto rounded">
          {results && results.length ? (
            <ul>
              {results.map((result) => {
                return <li key={result.clientId}>{result.clientName}</li>
              })}
            </ul>
          ) : (
            <>No Search Results</>
          )}
        </div>
      </Transition>
    </div>
  )
}

export const SearchBar = ({ params }: SearchProps) => {
  const ref = useRef<HTMLInputElement>(null)
  const contentRef = useRef(null)
  const [query, setQuery] = useState("")
  const { data: searchResults } = useQuery({
    ...clientSearchQuery({ ...params, query }),
    enabled: query.trim().length > 0,
  })

  useClickAway(
    () => {
      setQuery("")
    },
    { ref, exceptionRef: contentRef }
  )

  return (
    <div className="flex flex-1 justify-center px-2 lg:ml-6 lg:justify-end">
      <div className="w-full max-w-lg lg:max-w-xs">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <div className="relative text-gray-400 focus-within:text-gray-600">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
          </div>
          <input
            id="search"
            className="block w-full rounded-md border-0 bg-white py-1.5 pl-10 pr-3 text-gray-900 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Search"
            type="search"
            name="search"
            ref={ref}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="flex-shrink-0 flex-grow-0 hidden">
        {query.length &&
          createPortal(
            <SearchResults
              contentRef={contentRef}
              results={searchResults}
              tetherRef={ref}
            />,
            document.body
          )}
      </div>
    </div>
  )
}
