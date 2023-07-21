import { PaginationMeta } from "@/types"

export const TableFooter = ({
  data,
  onPage,
}: {
  data: PaginationMeta
  onPage: (page: number) => void
}) => {
  const numPages = Math.ceil(data.total / data.limit)
  const currentPage = data.page
  const start = currentPage * data.limit
  return (
    <nav
      className="flex items-center justify-between border-t px-4 py-3 sm:px-6 bg-base-100"
      aria-label="Pagination"
    >
      <div className="hidden sm:block text-base-content">
        <p className="text-sm flex gap-1">
          Showing
          <span className="font-medium">{start}</span>
          to
          <span className="font-medium">{start + data.limit}</span>
          of
          <span className="font-medium">{data.total}</span>
          results
        </p>
      </div>
      <div className="flex flex-1 gap-2 justify-between sm:justify-end">
        <button
          disabled={data.page === 0}
          aria-disabled={data.page === 0}
          className="btn btn-neutral"
          onClick={() => onPage(currentPage - 1)}
        >
          Previous
        </button>
        <button
          disabled={currentPage >= numPages}
          aria-disabled={currentPage >= numPages}
          className="btn btn-neutral"
          onClick={() => onPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </nav>
  )
}
