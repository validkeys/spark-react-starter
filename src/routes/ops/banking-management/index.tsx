import { useQuery } from "@tanstack/react-query"
import axios from "../../../utils/fetch"
import { MoneyMoveRequest } from "@/types"
import { useState } from "react"

type PaginationMeta = {
  total: number
  page: number
  limit: number
}

type MoneyMoveResponse = {
  requests: MoneyMoveRequest[]
  meta: PaginationMeta
}

const fetchTransactions = async (page = 0, limit = 10) => {
  await new Promise((r) => setTimeout(r, 3000))
  const { data } = await axios.get<MoneyMoveResponse>(
    "/api/v1/ops/mm-requests",
    {
      params: {
        page,
        limit,
      },
    }
  )
  return data
}

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

  const { isLoading, isFetching, data } = useQuery({
    queryKey: ["ops", "money-move-requests", page, limit],
    queryFn: () => fetchTransactions(page, limit),
    keepPreviousData: true,
  })

  if (isLoading) {
    return <div>Loading Transactions</div>
  }

  return (
    <>
      {isFetching && <div>Fetching Next Page...</div>}
      <div>
        {data?.requests.map((request) => {
          return <div>{request.id}</div>
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
