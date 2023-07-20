import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { getOpsMoneyMoveRequests } from "@/state"

const Pagination = ({
  data,
  onPage,
}: {
  data: PaginationMeta
  onPage: (page: number) => void
}) => {
  const numPages = Math.ceil(data.total / data.limit)
  const currentPage = data.page
  return (
    <div>
      <button
        disabled={currentPage === 0}
        onClick={() => onPage(currentPage - 1)}
      >
        Previous Page
      </button>
      <button
        disabled={currentPage >= numPages}
        onClick={() => onPage(currentPage + 1)}
      >
        Next Page
      </button>
    </div>
  )
}

export const Component = () => {
  const [page, setPage] = useState(0)
  const [limit] = useState(10)

  const { isLoading, isFetching, data } = useQuery(
    getOpsMoneyMoveRequests(page, limit)
  )

  if (isLoading) {
    return <div>Loading Transactions</div>
  }

  return (
    <>
      {isFetching && <div>Fetching Next Page...</div>}
      <div>
        {data?.requests.map((request) => {
          return <div key={request.id}>{request.id}</div>
        })}
      </div>
      <Pagination
        onPage={(pageNum) => setPage(pageNum)}
        data={data?.meta || { total: 0, limit: 0, page: 0 }}
      />
    </>
  )
}

export default Component
