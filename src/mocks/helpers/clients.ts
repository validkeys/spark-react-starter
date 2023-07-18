import { IModel } from "../types"
import { db } from "../db"

export type ClientProps = Partial<IModel<"client">>

export interface CreateClientProps {
  organizationId: string
  advisorId?: string
}
export const createClient = (
  ops: CreateClientProps,
  clientProps?: ClientProps
): IModel<"client"> => {
  const repCode = db.repCode.create({ organizationId: ops.organizationId })
  const account = db.account.create({ repCodeId: repCode.id })

  if (ops.advisorId) {
    db.advisorCode.create({ advisorId: ops.advisorId, repCodeId: repCode.id })
  }

  const client = db.client.create({
    repCodeId: repCode.id,
    ...(clientProps || {}),
  })

  db.accountOwner.create({ clientId: client.id, accountId: account.id })
  db.clientSummary.create({
    clientId: client.id,
    advisorId: ops.advisorId,
    repCodeId: repCode.id,
  })

  return client
}

export const getAdvisorClients = (advisorId: string): IModel<"client">[] => {
  const advisorRepCodes = db.advisorCode
    .findMany({
      where: { advisorId: { equals: advisorId } },
    })
    .map((ac) => ac.repCodeId)

  return db.client.getAll().filter((client) => {
    return advisorRepCodes.includes(client.repCodeId)
  })
}
