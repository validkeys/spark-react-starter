import { IModel } from "../types"
import { db } from "../db"

type AccountArgs = Partial<IModel<"account">>

interface CreateAccountArgs extends Omit<AccountArgs, "repCodeId"> {
  repCodeId: IModel<"account">["repCodeId"]
}

export const createAccount = (args: CreateAccountArgs) => {
  const account = db.account.create(args)
  const repCode = db.repCode.findFirst({
    where: {
      id: { equals: args.repCodeId },
    },
  })
  if (!repCode) {
    throw new Error("rep code not found")
  }
  db.accountSummary.create({
    id: account.id,
    organizationId: repCode.organizationId as string,
    accountId: account.id,
    ...args,
  })

  const clients = db.client.findMany({
    where: {
      repCodeId: { equals: repCode.id },
    },
  })

  clients.forEach((client) => {
    db.accountOwner.create({ clientId: client.id, accountId: account.id })
  })

  return account
}

export const createBankAccount = (args: { accountId: string }) => {
  const bankAccount = db.bankAccount.create()
  db.accountBankAccount.create({
    accountId: args.accountId,
    bankAccountId: bankAccount.id,
  })
  return bankAccount
}
