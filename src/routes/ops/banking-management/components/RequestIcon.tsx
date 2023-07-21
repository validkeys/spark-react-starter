import {
  ArrowSmallDownIcon,
  ArrowSmallUpIcon,
  ArrowsRightLeftIcon,
} from "@heroicons/react/20/solid"
import { type MoneyMoveRequest } from "@/types"

export const RequestIcon = ({ request }: { request: MoneyMoveRequest }) => {
  if (request.type === "ToBank") {
    return <ArrowSmallDownIcon className="w-8 h-8 text-red-500" />
  } else if (request.type === "FromBank") {
    return <ArrowSmallUpIcon className="w-8 h-8 text-green-400" />
  } else {
    return <ArrowsRightLeftIcon className="w-6 h-6 text-accent-content" />
  }
}
