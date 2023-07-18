import { rest } from "msw"
import decode from "jwt-decode"
import encode from "jwt-encode"
import { type RestRequest } from "msw"
import { db } from "./db"
import { ApiErrorResponse } from "@/types"
import { IModel } from "./types"

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

export const handlers = [
  sessionGet,
  sessionPost,
  sessionDestroy,
  permitsList,
  opsMmRequestsList,
]
