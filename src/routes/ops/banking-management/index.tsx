import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { getOpsMoneyMoveRequests } from "@/state"
import { PaginationMeta, MoneyMoveRequest } from "@/types"
import {
  ArrowSmallDownIcon,
  ArrowSmallUpIcon,
  ArrowsRightLeftIcon,
} from "@heroicons/react/20/solid"
import moment from "moment"
import { FormattedNumber } from "react-intl"

const RequestIcon = ({ request }: { request: MoneyMoveRequest }) => {
  if (request.type === "ToBank") {
    return <ArrowSmallDownIcon className="w-8 h-8 text-red-500" />
  } else if (request.type === "FromBank") {
    return <ArrowSmallUpIcon className="w-8 h-8 text-green-400" />
  } else {
    return <ArrowsRightLeftIcon className="w-6 h-6 text-accent-content" />
  }
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

export const Component = () => {
  const [page, setPage] = useState(0)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [limit] = useState(10)

  const { isLoading, data } = useQuery(getOpsMoneyMoveRequests(page, limit))

  const markSelected = (status: "approve" | "reject") => {
    console.log("mark selected", status)
  }

  const toggleSelectAll = () => {
    if (selectedItems.length) {
      setSelectedItems([])
    } else {
      const itemIds = data?.requests.map((item) => item.id) || []
      setSelectedItems(itemIds)
    }
  }

  const toggleItem = (request: MoneyMoveRequest) => {
    if (selectedItems.includes(request.id)) {
      setSelectedItems((prev) => {
        return prev.filter((item) => item !== request.id)
      })
    } else {
      setSelectedItems((prev) => [...prev, request.id])
    }
  }

  useEffect(() => {
    setSelectedItems([])
  }, [data?.requests])

  if (isLoading) {
    return <div>Loading Transactions</div>
  }

  return (
    <div className="spark-container">
      <div className="ci-page-heading bg-base-300 text-base-content shadow-none">
        <div className="ci-page-heading-section">Ops: Banking Management</div>
        <div>
          <div className="flex flex-row gap-4">
            <div className="flex-grow"></div>
            <button
              className="btn"
              type="button"
              onClick={() => markSelected("approve")}
            >
              <span>&#10003;</span> Approve
            </button>
            <button
              className="btn btn-error"
              type="button"
              onClick={() => markSelected("reject")}
            >
              <span>&#88;</span> Reject
            </button>
          </div>
        </div>
      </div>
      <div className="ci-container">
        <div className="flex-1 grid gap-4">
          <div className="grid gap-4">
            <div>
              <table className="table ci-table">
                <thead>
                  <tr className="h-12 bg-base-300">
                    <th></th>
                    <th>Client</th>
                    <th>From Account</th>
                    <th>Activity</th>
                    <th>Bank</th>
                    <th>To Account</th>
                    <th>Method</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary checkbox-xs rounded-none"
                        checked={selectedItems.length === data?.requests.length}
                        onClick={(e) => toggleSelectAll()}
                        onChange={() => {}}
                      />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data?.requests.map((request) => {
                    return (
                      <tr
                        key={request.id}
                        className="h-12 bg-base-200 even:bg-base-100"
                      >
                        <td className="text-center">
                          <div className="flex items-center justify-center">
                            <RequestIcon request={request} />
                          </div>
                        </td>
                        <td>{request.client?.name}</td>
                        <td>
                          {request.type === "FromBank"
                            ? request.bankAccountNumber
                            : request.financialAccountNumber}
                        </td>
                        <td>{request.type}</td>
                        <td>{request.bankInstitutionNumber}</td>
                        <td>
                          {request.type === "FromBank"
                            ? request.financialAccountNumber
                            : request.bankAccountNumber}
                        </td>
                        <td>{request.method}</td>
                        <td>{moment(request.createdDate).format("lll")}</td>
                        <td>
                          <FormattedNumber
                            value={request.amount || 0}
                            currency={request.currencyCode}
                            style="currency"
                          />
                        </td>
                        <td>
                          <label htmlFor="selected">
                            <input
                              name="selected"
                              type="checkbox"
                              checked={selectedItems.includes(request.id)}
                              onChange={() => toggleItem(request)}
                            />
                          </label>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <Pagination
              onPage={(pageNum) => setPage(pageNum)}
              data={data?.meta || { total: 0, limit: 0, page: 0 }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Component
