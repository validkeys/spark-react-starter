import { rest, type RequestHandler } from "msw"
import { ENTITY_TYPE, PRIMARY_KEY } from "@mswjs/data"
import { db } from "../db"

type Seed = "common"
export interface Config {
  handlers?: RequestHandler[]
  baseUrl?: string
  useSeed?: Seed
}

export type PostHandler = Parameters<typeof rest.post>
export type GetHandler = Parameters<typeof rest.get>
export type DeleteHandler = Parameters<typeof rest.delete>

interface HandlerConfig {
  path: string
  method: "get" | "post" | "put" | "delete"
}
export interface PostConfig extends HandlerConfig {
  handler: PostHandler[1]
}

export interface GetConfig extends HandlerConfig {
  handler: GetHandler[1]
}

export interface DeleteConfig extends HandlerConfig {
  handler: DeleteHandler[1]
}

export type ApiHandlerConfig = PostConfig | GetConfig | DeleteConfig

export type IModel<Key extends keyof typeof db> = Omit<
  ReturnType<(typeof db)[Key]["create"]>,
  typeof ENTITY_TYPE | typeof PRIMARY_KEY
>
