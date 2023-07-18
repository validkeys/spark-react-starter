/* eslint-disable @typescript-eslint/unbound-method */
import { factory, primaryKey, nullable } from "@mswjs/data"
import { faker } from "@faker-js/faker"

export const db = factory({
  client: {
    id: primaryKey(faker.string.uuid),
    name: faker.person.fullName,
    primaryContactId: nullable(String),
    repCodeId: faker.string.uuid,
  },
  organization: {
    id: primaryKey(faker.string.uuid),
    name: faker.company.name,
  },
  permit: {
    id: primaryKey(faker.string.uuid),
    userId: nullable(String),
    organizationId: nullable(String),
    advisorId: nullable(String),
    clientId: nullable(String),
    branchId: nullable(String),
    regionId: nullable(String),
    roleId: nullable(String),
  },
  role: {
    id: primaryKey(faker.string.uuid),
    name: faker.word.noun,
    organizationId: nullable(String),
    type: () => 0,
    isAdmin: (): boolean => true,
  },
  advisor: {
    id: primaryKey(faker.string.uuid),
    name: faker.person.fullName,
    organizationId: nullable(String),
  },
  advisorCode: {
    id: primaryKey(faker.string.uuid),
    advisorId: String,
    repCodeId: String,
    ownershipPercent: () => faker.number.float({ min: 0, max: 1 }),
  },
  user: {
    id: primaryKey(faker.string.uuid),
    name: faker.person.fullName,
    email: faker.internet.email,
    password: faker.internet.password,
    organizationId: nullable(String),
  },
  contact: {
    id: primaryKey(faker.string.uuid),
    displayName: faker.company.name,
    companyName: faker.company.name,
    firstName: faker.person.firstName,
    middleName: faker.person.middleName,
    lastName: faker.person.lastName,
    status: () => 0,
    lastUpdate: faker.date.past,
  },
  contactDetail: {
    id: primaryKey(faker.string.uuid),
    contactableType: () => "advisor",
    contactableId: nullable(String),
    type: () => "email",
    value: faker.internet.email,
    lastUpdate: faker.date.past,
  },
  repCode: {
    id: primaryKey(faker.string.uuid),
    organizationId: nullable(String),
    code: faker.lorem.word,
  },
  account: {
    id: primaryKey(faker.string.uuid),
    accountNumber: faker.finance.accountNumber,
    repCodeId: String,
    accountName: () =>
      faker.helpers.arrayElement(["RESP", "TFSA", "Brokerage", "RRSP"]),
    accountType: () =>
      faker.helpers.arrayElement(["RRSP", "RESP", "TFSA", "Brokerage"]),
    currencyCode: faker.finance.currencyCode,
    openDate: () => faker.date.past({ years: 1 }),
    status: () => 0,
    closeDate: nullable(Date),
  },
  accountSummary: {
    id: primaryKey(faker.string.uuid),
    organizationId: String,
    regionId: nullable(String),
    branchId: nullable(String),
    accountId: String,
    repCodeId: String,
    clientId: String,
    accountName: () =>
      faker.helpers.arrayElement(["RRSP", "RESP", "TFSA", "Brokerage"]),
    accountNumber: faker.finance.accountNumber,
    accountType: () =>
      faker.helpers.arrayElement(["RRSP", "RESP", "TFSA", "Brokerage"]),
    currencyCode: faker.finance.currencyCode,
    openDate: () => faker.date.past({ years: 1 }),
    status: () => 0,
    closeDate: nullable(Date),
    marketValue: () => faker.finance.amount(10000, 1000000, 2),
    gainLoss: () => faker.number.float({ min: -1, max: 1, precision: 0.11 }),
    percentageOfClient: () =>
      faker.number.float({
        min: -100,
        max: 100,
        precision: 0.11,
      }),
    asOfDate: () => new Date(),
  },
  accountPerformance: {
    organizationId: String,
    accountId: primaryKey(String),
    repCodeId: String,
    regionId: nullable(String),
    branchId: nullable(String),
    asOfDate: faker.date.recent,
    month_1: () => faker.number.float({ min: 1, max: 100 }),
    month_3: () => faker.number.float({ min: 1, max: 100 }),
    year_1: () => faker.number.float({ min: 1, max: 100 }),
    year_3: () => faker.number.float({ min: 1, max: 100 }),
    year_5: () => faker.number.float({ min: 1, max: 100 }),
    ytd: () => faker.number.float({ min: 1, max: 100 }),
    inception: () => faker.number.float({ min: 1, max: 100 }),
  },
  accountPosition: {
    _id: primaryKey(faker.string.uuid),
    organizationId: String,
    accountId: String,
    repCodeId: String,
    regionId: nullable(String),
    branchId: nullable(String),
    securityId: faker.string.uuid,
    securityName: faker.company.name,
    securityType: () => "stock",
    ticker: () => faker.string.alphanumeric(4),
    currencyCode: () => faker.helpers.arrayElement(["cad", "usd"]),
    price: faker.commerce.price,
    numShares: () => faker.number.int({ min: 10, max: 1000 }),
    marketValue: faker.commerce.price,
    bookValue: faker.commerce.price,
    gainLoss: () =>
      faker.number.float({ min: -10000, max: 10000, precision: 0.11 }),
    percentageOfAccount: () => faker.number.float({ min: 1, max: 100 }),
  },
  accountTransaction: {
    _id: primaryKey(faker.string.uuid),
    organizationId: String,
    accountId: String,
    repCodeId: String,
    regionId: nullable(String),
    branchId: nullable(String),
    tradeDate: faker.date.recent,
    settlementDate: faker.date.recent,
    transactionType: () => faker.helpers.arrayElement(["buy", "sell"]),
    description: faker.lorem.words,
    securityName: faker.company.name,
    currencyCode: faker.finance.currencyCode,
    price: () => parseFloat(faker.commerce.price()),
    numShares: () => faker.number.int({ min: 100, max: 20000 }),
    netAmount: () => faker.number.int({ min: 100, max: 20000 }),
    commission: () => parseFloat(faker.commerce.price()),
  },
  assetAllocation: {
    _id: primaryKey(faker.string.uuid),
    accountId: String,
    clientId: String,
    repCodeId: String,
    accountNumber: faker.finance.accountNumber,
    accountName: () =>
      faker.helpers.arrayElement(["RESP", "TFSA", "Brokerage", "RRSP"]),
    accountType: () =>
      faker.helpers.arrayElement(["RESP", "TFSA", "Brokerage", "RRSP"]),
    currencyCode: faker.finance.currencyCode,
    openDate: () => faker.date.past({ years: 1 }),
    status: () => 0,
    closeDate: nullable(Date),
    asOfDate: faker.date.recent,
    assetClass: () =>
      faker.helpers.arrayElement(["equity", "funds", "cash", "fixed income"]),
    marketValue: () =>
      parseFloat(faker.finance.amount({ min: 10000, max: 1000000 })),
    actualPercent: () =>
      faker.number.float({ min: 0.01, max: 1, precision: 0.12 }),
    targetPercent: () =>
      faker.number.float({ min: 0.01, max: 1, precision: 0.12 }),
  },
  clientContact: {
    id: primaryKey(faker.string.uuid),
    clientId: String,
    contactId: String,
    status: () => 0,
    contactType: () =>
      faker.helpers.arrayElement(["family", "lawyer", "accountant"]),
  },
  accountOwner: {
    id: primaryKey(faker.string.uuid),
    accountId: String,
    clientId: String,
    ownershipPercent: () =>
      faker.number.float({ min: 0.01, max: 1, precision: 0.12 }),
  },
  clientSummary: {
    clientId: primaryKey(String),
    organizationId: nullable(String),
    regionId: nullable(String),
    branchId: nullable(String),
    advisorId: nullable(String),
    repCodeId: String,
    advisorName: faker.person.fullName,
    clientName: faker.person.fullName,
    currencyCode: () => faker.helpers.arrayElement(["CAD", "USD"]),
    marketValue: () => faker.number.float({ min: 50000, max: 10000000 }),
    gainLoss: () => faker.number.float({ min: -1, max: 1 }),
    asOfDate: () => new Date(),
  },
  moneyMoveRequest: {
    id: primaryKey(faker.string.uuid),
    clientId: String,
    amount: () =>
      faker.number.float({ min: 1000, max: 1000000, precision: 0.11 }),
    currencyCode: () => faker.helpers.arrayElement(["cad", "usd"]),
    method: () => faker.helpers.arrayElement(["EFT", "cheque"]),
    type: () => faker.helpers.arrayElement(["ToBank", "FromBank", "Internal"]),
    financialAccountNumber: faker.finance.accountNumber,
    bankAccountNumber: faker.finance.accountNumber,
    bankInstitutionNumber: faker.finance.bic,
    frequencyType: () => faker.helpers.arrayElement(["One-time", "Recur"]),
    startDate: faker.date.soon,
    createdBy: faker.person.fullName,
    createdDate: faker.date.soon,
    updatedBy: faker.person.fullName,
    updatedDate: () => new Date(),
    status: () =>
      faker.helpers.arrayElement([
        "pending",
        "approved",
        "rejected",
        "fulfilled",
      ]),
  },
  accountBankAccount: {
    id: primaryKey(faker.string.uuid),
    source: () => "any",
    sourceId: () => "any",
    accountId: String,
    bankAccountId: String,
    status: () => "active",
  },
  bankAccount: {
    id: primaryKey(faker.string.uuid),
    source: () => "any",
    sourceId: () => "any",
    institutionCode: faker.finance.bic,
    transitNo: faker.finance.routingNumber,
    accountNo: faker.finance.accountNumber,
    holderName: faker.person.fullName,
    description: faker.finance.accountName,
    setupDate: faker.date.past,
    lastUpdate: faker.date.recent,
  },
})
