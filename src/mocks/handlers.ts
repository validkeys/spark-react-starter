import { rest } from "msw"
import decode from "jwt-decode"
import encode from "jwt-encode"
import { type RestRequest } from "msw"
import { db } from "./db"
import { ApiErrorResponse, ClientSearchResults, ClientSummary } from "@/types"
import { IModel } from "./types"
import { getAdvisorClients } from "./helpers"

interface TokenData {
  id: string
}

type User = IModel<"user">

export const createSessionToken = (user: User): string => {
  const tokenData: TokenData = { id: user.id }
  const token = encode(tokenData, "secret")
  return token
}

export const readSessionToken = (token: string): TokenData => {
  return decode<TokenData>(token)
}

const getSessionToken = (req: RestRequest): string | null => {
  const header =
    req.headers.get("authorization") || req.headers.get("Authorization")
  if (!header) {
    return null
  }

  return header.split("Bearer ")[1]
}

export const getSession = (req: RestRequest): TokenData | null => {
  const token = getSessionToken(req)

  if (!token) {
    return null
  }

  return decode<TokenData>(token)
}

const sessionGet = rest.get("/api/v1/sessions", (req, res, ctx) => {
  const session = getSession(req)

  if (!session) {
    return res(
      ctx.status(401),
      ctx.json({
        errors: [
          {
            error: "Unauthenticated",
            message: "No session found",
            statusCode: 401,
          },
        ],
      } as ApiErrorResponse)
    )
  }

  const user = db.user.findFirst({
    where: {
      id: {
        equals: session.id,
      },
    },
  })

  if (!user) {
    return res(
      ctx.status(401),
      ctx.json({
        errors: [
          {
            error: "Unauthenticated",
            message: "No user found",
            statusCode: 401,
          },
        ],
      } as ApiErrorResponse)
    )
  }

  return res(
    ctx.status(200),
    ctx.json({
      token: createSessionToken(user),
      user,
    })
  )
})

const sessionDestroy = rest.delete("/api/v1/sessions", (req, res, ctx) => {
  return res(ctx.status(204))
})

interface PostBody {
  email: string
  password: string
}
const sessionPost = rest.post<PostBody>(
  "/api/v1/sessions",
  async (req, res, ctx) => {
    try {
      const body: PostBody = await req.json()

      const user = db.user.findFirst({
        where: {
          email: { equals: body.email },
          password: { equals: body.password },
        },
      })

      if (!user) {
        return res(
          ctx.status(401),
          ctx.json({
            errors: [
              {
                error: "User not found",
                message: "Email / Password combination not found",
                statusCode: 401,
              },
            ],
          } as ApiErrorResponse)
        )
      }

      const token = createSessionToken(user)

      return res(ctx.status(201), ctx.json({ token, user }))
    } catch (error) {
      const e = error as Error
      return res(ctx.status(500), ctx.json({ message: e.message }))
    }
  }
)

interface NestedPermit extends IModel<"permit"> {
  role?: IModel<"role">
  organization?: IModel<"organization">
  advisor?: IModel<"advisor">
  client?: IModel<"client">
}

const permitsList = rest.get(
  "/api/v1/users/:userId/permits",
  (req, res, ctx) => {
    const session = getSession(req)
    if (!session) {
      return res(
        ctx.status(401),
        ctx.json({
          errors: [{ error: "Unauthenticated" }],
        })
      )
    }
    const permits = db.permit
      .findMany({
        where: {
          userId: {
            equals: session.id,
          },
        },
      })
      .map((permit) => {
        const response: NestedPermit = { ...permit }
        const role = db.role.findFirst({
          where: { id: { equals: permit.roleId as string } },
        })
        response.role = role as IModel<"role">

        if (permit.organizationId) {
          response.organization = db.organization.findFirst({
            where: {
              id: { equals: permit.organizationId },
            },
          }) as IModel<"organization">
        }

        if (permit.advisorId) {
          response.advisor = db.advisor.findFirst({
            where: {
              id: { equals: permit.advisorId },
            },
          }) as IModel<"advisor">
        }

        return response
      })

    return res(ctx.status(200), ctx.json({ permits }))
  }
)

interface ClientComposite {
  client: IModel<"client">
  advisor: IModel<"advisor"> | null
}
type ClientLookup = Record<IModel<"client">["id"], ClientComposite>

const opsMmRequestsList = rest.get(
  "/api/v1/ops/mm-requests",
  function (req, res, ctx) {
    const page = Number(req.url.searchParams.get("page") || 0)
    const limit = Number(req.url.searchParams.get("limit") || 100)

    const clients = db.client.getAll().reduce((obj, client) => {
      const advisorCode = db.advisorCode.findFirst({
        where: {
          repCodeId: { equals: client.repCodeId },
        },
      })

      let advisor = null

      if (advisorCode) {
        advisor = db.advisor.findFirst({
          where: {
            id: { equals: advisorCode.advisorId },
          },
        })
      }

      const composite: ClientComposite = {
        client,
        advisor,
      }
      return {
        ...obj,
        [client.id]: composite,
      }
    }, {} as ClientLookup)

    const allRequests = db.moneyMoveRequest.getAll()

    const requests = db.moneyMoveRequest
      .findMany({
        take: limit,
        skip: Number(page * limit),
      })
      .map((mm) => {
        return {
          ...mm,
          ...(clients[mm.clientId] || {}),
        }
      })

    return res(
      ctx.status(200),
      ctx.json({
        requests: requests,
        meta: {
          total: allRequests.length,
          page,
          limit,
        },
      })
    )
  }
)

const opsMmBatchUpdate = rest.post(
  "/api/v1/ops/mm-requests/batch-update",
  async (req, res, ctx) => {
    const body = await req.json<{
      ids: string[]
      action: "approve" | "reject"
    }>()

    const status = body.action === "approve" ? "approved" : "rejected"
    db.moneyMoveRequest.updateMany({
      where: {
        id: {
          in: body.ids,
        },
      },
      data: {
        status,
      },
    })

    const requests = db.moneyMoveRequest.findMany({
      where: {
        id: { in: body.ids },
      },
    })

    return res(ctx.status(200), ctx.json({ requests }))
  }
)

const orgGet = rest.get(
  "/api/v1/organizations/:organizationId",
  function (req, res, ctx) {
    const organization = db.organization.findFirst({
      where: {
        id: {
          equals: req.params["organizationId"] as string,
        },
      },
    })

    if (!organization) {
      return res(
        ctx.status(404),
        ctx.json({
          errors: [
            {
              error: "Organization not found",
              message: `Could not find organization#${req.params["organizationId"]}`,
              statusCode: 401,
            },
          ],
        } as ApiErrorResponse)
      )
    }

    return res(ctx.status(200), ctx.json({ organization }))
  }
)

const advisorGet = rest.get(
  "/api/v1/organizations/:organizationId/advisors/:advisorId",
  function (req, res, ctx) {
    const advisor = db.advisor.findFirst({
      where: {
        id: {
          equals: req.params["advisorId"] as string,
        },
        organizationId: {
          equals: req.params["organizationId"] as string,
        },
      },
    })

    if (!advisor) {
      return res(
        ctx.status(404),
        ctx.json({
          errors: [
            {
              error: "advisor not found",
              message: `Could not find advisor#${req.params["advisorId"]}`,
              statusCode: 401,
            },
          ],
        } as ApiErrorResponse)
      )
    }

    return res(ctx.status(200), ctx.json({ advisor }))
  }
)

const opsClientSearch = rest.get(
  "/api/v1/clientSummaries",
  function (req, res, ctx) {
    const accumulator: ClientSummary[] = []
    const query = req.url.searchParams.get("query")
    const clients = db.client.getAll()

    let clientSummaries: ClientSearchResults = clients.reduce((arr, client) => {
      const data: ClientSummary = {
        clientId: client.id,
        advisorId: "",
        organizationId: "",
        branchId: null,
        regionId: null,
        clientName: client.name,
        advisorName: "",
      }

      return [...arr, data]
    }, accumulator)

    if (query && query.length) {
      const pattern = new RegExp(query, "i")
      clientSummaries = clientSummaries.filter((cs) => {
        return pattern.test(cs.clientName)
      })
    }

    return res(ctx.status(200), ctx.json(clientSummaries))
  }
)

const advisorClientSearch = rest.get(
  "/api/v1/organizations/:organizationId/advisors/:advisorId/clientSummaries",
  function (req, res, ctx) {
    const accumulator: ClientSummary[] = []
    const query = req.url.searchParams.get("query")
    const advisor = db.advisor.findFirst({
      where: {
        id: { equals: req.params["advisorId"] as string },
      },
    }) as IModel<"advisor">
    const advisorCodes = db.advisorCode.findMany({
      where: {
        advisorId: { equals: req.params["advisorId"] as string },
      },
    })
    const repCodes = advisorCodes.map((advisorCode) => advisorCode.repCodeId)

    const clients = db.client.getAll().filter((client) => {
      return repCodes.includes(client.repCodeId)
    })

    let clientSummaries: ClientSearchResults = clients.reduce((arr, client) => {
      const data: ClientSummary = {
        clientId: client.id,
        advisorId: advisor.id as string,
        organizationId: advisor?.organizationId as string,
        branchId: null,
        regionId: null,
        clientName: client.name,
        advisorName: advisor?.name as string,
      }

      return [...arr, data]
    }, accumulator)

    if (query && query.length) {
      const pattern = new RegExp(query, "i")
      clientSummaries = clientSummaries.filter((cs) => {
        return pattern.test(cs.clientName)
      })
    }

    return res(ctx.status(200), ctx.json(clientSummaries))
  }
)

const clientGet = rest.get(
  "/api/v1/organizations/:organizationId/advisors/:advisorId/clients/:clientId",
  function (req, res, ctx) {
    const client = db.client.findFirst({
      where: {
        id: {
          equals: req.params["clientId"] as string,
        },
      },
    })

    if (!client) {
      return res(
        ctx.status(404),
        ctx.json({
          errors: [
            {
              error: "Not Found",
              message: "Client not found",
              statusCode: 404,
            },
          ],
        })
      )
    }

    return res(
      ctx.status(200),
      ctx.json({
        client: {
          ...client,
          advisor: db.advisor.findFirst({
            where: {
              id: { equals: req.params["advisorId"] as string },
            },
          }),
          investmentSummary: db.clientSummary.findFirst({
            where: {
              clientId: { equals: client.id },
            },
          }),
        },
      })
    )
  }
)

export const handlers = [
  sessionGet,
  sessionPost,
  sessionDestroy,
  permitsList,
  opsMmRequestsList,
  opsMmBatchUpdate,
  orgGet,
  advisorGet,
  opsClientSearch,
  advisorClientSearch,
  clientGet,
]
