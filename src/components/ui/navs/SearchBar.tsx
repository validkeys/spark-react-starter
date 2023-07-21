import { MagnifyingGlassIcon } from "@heroicons/react/20/solid"
import {
  useState,
  RefObject,
  useEffect,
  useRef,
  createContext,
  useContext,
} from "react"
import { clientSearchQuery, useClickAway, useRefPosition } from "@/state"
import { useQuery } from "@tanstack/react-query"
import { ClientSearchResults } from "@/types"
import { createPortal } from "react-dom"

type SearchProps = {
  params: {
    organizationId: null | string
    advisorId: null | string
  }
}

type SearchContentShape = {
  tetherRef: RefObject<HTMLElement | HTMLDivElement>
  contentRef: RefObject<HTMLElement | HTMLDivElement>
}

const SearchContext = createContext<Partial<SearchContentShape>>({})

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

const SearchResults = ({ results }: { results: ClientSearchResults }) => {
  const { tetherRef, contentRef } = useContext(
    SearchContext
  ) as Required<SearchContentShape>
  const { ready, ...position } = usePosition(tetherRef, contentRef)

  return (
    <div
      ref={contentRef}
      className={`fixed ${ready ? "block" : "hidden -right-full"}`}
      style={position}
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
    </div>
  )
}

const SearchResultsPanel = ({ results }: { results: ClientSearchResults }) => {
  return results.length ? <SearchResults results={results} /> : <></>
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
    <SearchContext.Provider value={{ tetherRef: ref, contentRef }}>
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
          {createPortal(
            <SearchResultsPanel results={searchResults || []} />,
            document.body
          )}
        </div>
      </div>
    </SearchContext.Provider>
  )
}
