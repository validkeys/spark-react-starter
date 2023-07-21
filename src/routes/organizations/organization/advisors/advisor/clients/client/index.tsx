import { clientQuery } from "@/state"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { PhoneIcon, EnvelopeIcon } from "@heroicons/react/20/solid"
import { FormattedNumber } from "react-intl"
import { FlagIcon } from "@/components/ui/icons/FlagIcon"
import { useState } from "react"
import { Currency } from "@/types"
import { Heading, SubNav } from "@/components/ui/page"
import { ActionsMenu } from "./components/ActionsMenu"

export const Component = () => {
  const { organizationId, advisorId, clientId } = useParams() as {
    organizationId: string
    advisorId: string
    clientId: string
  }
  const { data, isLoading, isError } = useQuery(
    clientQuery(clientId, { organizationId, advisorId })
  )
  const [currency, setCurrency] = useState<Currency>("cad")

  if (isLoading) {
    return <>Loading Client Data...</>
  }

  if (isError) {
    return <>Error Loading Client</>
  }

  const { client } = data

  return (
    <>
      <Heading className="bg-primary text-primary-content">
        <div className="flex flex-row gap-8">
          {client.name}
          <div className="ci-page-heading-section-body flex flex-row gap-2 text-xs my-auto">
            <PhoneIcon className="w-4 h-4" />
            <EnvelopeIcon className="w-4 h-4" />
          </div>
        </div>
        <div className="flex flex-row gap-8 text-xs">
          <span>
            Advisor:
            {client.advisor.name}
          </span>
          <div className="flex flex-row gap-4">
            {client.investmentSummary?.marketValue && (
              <div className="text-lg">
                <FormattedNumber
                  value={client.investmentSummary.marketValue || 0}
                  currency={client.investmentSummary.currencyCode || "usd"}
                  style="currency"
                />
              </div>
            )}

            <div className="flex flex-row gap-0">
              <div className="h-full w-4 my-auto text-lg">
                <FlagIcon currencyCode={currency} />
              </div>
              <select
                className="select select-sm bg-transparent py-0 border-transparent focus:outline-transparent focus:border-transparent focus:ring-transparent"
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
              >
                <option value="cad">in CAD</option>
                <option value="usd">in USD</option>
              </select>
            </div>
          </div>
        </div>
      </Heading>
      <SubNav
        items={[
          { href: "./", name: "Financial" },
          { href: "./kyc", name: "KYC" },
          { href: "./documents", name: "Documents" },
        ]}
        extras={() => <ActionsMenu />}
      />
    </>
  )
}
