import { useMutation, useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { getOpsMoneyMoveRequests, updateOpsMoneyMoveRequests } from "@/state"
import { MoneyMoveRequest } from "@/types"
import moment from "moment"
import { FormattedNumber } from "react-intl"
import { TableFooter as Pagination } from "@/components/ui/pagination/TableFooter"
import { RequestIcon } from "./components/RequestIcon"
import { ReactQueryErrorNotifications } from "@/components/ui/notifications/ReactQueryErrorNotifications"
import { toast } from "react-toastify"
import { Heading } from "@/components/ui/page/Heading"

export const Component = () => {
  const batchUpdateMutation = useMutation({
    ...updateOpsMoneyMoveRequests(),
    onSuccess(data, variables) {
      toast.success(
        `${variables.ids.length} requests ${
          variables.action === "approve" ? "approved" : "rejected"
        }`
      )
    },
  })
  const [page, setPage] = useState(0)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [limit] = useState(10)

  const { isLoading, data } = useQuery(getOpsMoneyMoveRequests(page, limit))

  useEffect(() => {
    if (batchUpdateMutation.isSuccess) {
      setSelectedItems([])
    }
  }, [batchUpdateMutation.isLoading, batchUpdateMutation.isSuccess])

  const markSelected = (status: "approve" | "reject") => {
    console.log("mark selected", status, selectedItems)
    batchUpdateMutation.mutate({
      ids: selectedItems,
      action: status,
    })
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
    <>
      <ReactQueryErrorNotifications query={batchUpdateMutation} />
      <Heading className="bg-base-100">
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
      </Heading>
      <div className="spark-container">
        <div className="ci-container">
          <div className="flex-1 grid gap-4">
            <div className="grid gap-4">
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

              <Pagination
                onPage={(pageNum) => setPage(pageNum)}
                data={data?.meta || { total: 0, limit: 0, page: 0 }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Component
