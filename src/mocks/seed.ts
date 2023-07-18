import { db } from "./db"
import {
  createStandardRoles,
  createAdvisor,
  createOrganization,
  createClient,
  createAccount,
} from "./helpers"
import { faker } from "@faker-js/faker"
import { IModel } from "./types"

export enum ContactTypes {
  PHONE = "PHONE",
  EMAIL = "EMAIL",
  ADDRESS = "ADDRESS",
}

export enum ContactableTypes {
  ADVISOR = "advisor",
  CLIENT = "client",
  CONTACT = "contact",
}

export default () => {
  const roles = createStandardRoles()

  const Users = {
    root: db.user.create({
      id: "0a4724bc-4093-4778-9111-93a5633abe5c",
      email: "advisoradmin@ci.com",
      password: "password",
      organizationId: null,
    }),
  }

  const { organization } = createOrganization({
    id: "b7e03941-1254-4789-9ffd-36d8041bdf3c",
    name: "CI Financial",
  })

  const { advisor } = createAdvisor({
    id: "88160259-8aa0-42e8-a067-0534384d442d",
    organizationId: organization.id,
    name: "Pooran Financial",
  })

  const client = createClient(
    { organizationId: organization.id, advisorId: advisor.id },
    {
      id: "88160259-8aa0-42e8-a067-0534384d4421",
      name: "Spark Test Client",
    }
  )

  setupClient(client)

  // System Administrator
  db.permit.create({
    userId: Users.root.id,
    roleId: roles.sysAdmin.id,
    organizationId: null,
    advisorId: null,
    clientId: null,
  })

  // Advisor Admin
  db.permit.create({
    userId: Users.root.id,
    organizationId: organization.id,
    advisorId: advisor.id,
    clientId: null,
    roleId: roles.advisorAdmin.id,
  })

  // Ops Admin
  db.permit.create({
    userId: Users.root.id,
    roleId: roles.opsAdmin.id,
  })

  function createClientContacts(client: IModel<"client">) {
    const primaryContact = db.contact.create()
    db.client.update({
      where: {
        id: { equals: client.id },
      },
      data: {
        primaryContactId: primaryContact.id,
      },
    })
    db.contactDetail.create({
      contactableType: ContactableTypes.CLIENT,
      contactableId: client.id,
      type: ContactTypes.EMAIL,
      value: faker.internet.email(),
    })
    db.contactDetail.create({
      contactableType: ContactableTypes.CLIENT,
      contactableId: client.id,
      type: ContactTypes.PHONE,
      value: faker.phone.number(),
    })

    db.contactDetail.create({
      contactableType: ContactableTypes.CONTACT,
      contactableId: primaryContact.id,
      type: ContactTypes.EMAIL,
      value: faker.internet.email(),
    })
    db.contactDetail.create({
      contactableType: ContactableTypes.CONTACT,
      contactableId: primaryContact.id,
      type: ContactTypes.PHONE,
      value: faker.phone.number(),
    })
  }

  function setupAccountPositions(account: IModel<"account">) {
    const repCode = db.repCode.findFirst({
      where: { id: { equals: account.repCodeId } },
    })

    if (!repCode) {
      throw new Error("No rep code found")
    }

    Array.from({ length: 5 }).forEach(() => {
      db.accountPosition.create({
        accountId: account.id,
        repCodeId: account.repCodeId,
        organizationId: repCode.organizationId as string,
      })
    })
  }

  function setupAccountTransactions(account: IModel<"account">) {
    const repCode = db.repCode.findFirst({
      where: { id: { equals: account.repCodeId } },
    })

    if (!repCode) {
      throw new Error("No rep code found")
    }

    Array.from({ length: 5 }).forEach(() => {
      db.accountTransaction.create({
        accountId: account.id,
        repCodeId: account.repCodeId,
        organizationId: repCode.organizationId as string,
      })
    })
  }

  function setupAssetAllocations(
    account: IModel<"account">,
    client: IModel<"client">
  ): void {
    ;["equity", "funds", "cash", "fixed income"].forEach((assetClass) => {
      db.assetAllocation.create({
        accountId: account.id,
        clientId: client.id,
        repCodeId: client.repCodeId,
        assetClass,
      })
    })
  }

  function createClientAccounts(client: IModel<"client">) {
    const accounts = [
      createAccount({ repCodeId: client.repCodeId }),
      createAccount({ repCodeId: client.repCodeId }),
      createAccount({ repCodeId: client.repCodeId }),
      createAccount({ repCodeId: client.repCodeId }),
    ]

    // Create Account Performance
    accounts.forEach((account) => {
      db.accountPerformance.create({
        accountId: account.id,
        repCodeId: account.repCodeId,
        organizationId: advisor?.organizationId as string,
      })

      setupAccountPositions(account)
      setupAccountTransactions(account)
      setupAssetAllocations(account, client)

      const bankAccount = db.bankAccount.create()
      db.accountBankAccount.create({
        accountId: account.id,
        bankAccountId: bankAccount.id,
      })
    })
  }

  function setupClient(client: IModel<"client">) {
    createClientContacts(client)
    createClientAccounts(client)

    Array.from({ length: 10 }).forEach(() => {
      db.moneyMoveRequest.create({ clientId: client.id })
    })
  }

  Array.from({ length: 50 }).forEach(() => {
    const client = createClient({
      organizationId: advisor.organizationId as string,
      advisorId: advisor.id,
    })
    setupClient(client)
  })
}
