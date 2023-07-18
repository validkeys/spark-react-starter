import { Outlet, createBrowserRouter } from "react-router-dom"
import { Component as ApplicationRoute } from "../routes/application"
import IndexRoute from "../routes/index"
import SessionRoute from "@/components/routing/routes/SessionRoute"
import {
  getSessionQuery,
  organizationAdvisorQuery,
  organizationQuery,
} from "@/state"
import { queryClient } from "../utils/react-query"
import { ErrorBoundary } from "../components/routing/ErrorBoundary"
import { AuthenticatedResponse } from "@/types"

const isAuthenticated = (): boolean => {
  const session = queryClient.getQueryData<AuthenticatedResponse>(
    getSessionQuery().queryKey
  )

  return session && session.user ? true : false
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: ApplicationRoute,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: (
          <SessionRoute>
            <IndexRoute />
          </SessionRoute>
        ),
      },
      {
        path: "login",
        lazy: () => import("../routes/login"),
      },
      {
        path: "ops",
        lazy: () => import("../routes/ops"),
        children: [
          {
            path: "banking-management",
            lazy: () => import("../routes/ops/banking-management"),
          },
        ],
      },
      {
        path: "organizations",
        element: (
          <SessionRoute>
            <Outlet />
          </SessionRoute>
        ),
        children: [
          {
            path: ":organizationId",
            loader: async ({ params }) => {
              if (!isAuthenticated()) {
                return null
              }
              const query = organizationQuery(params.organizationId as string)
              const existingData = queryClient.getQueryData(query.queryKey)
              const response =
                existingData || (await queryClient.fetchQuery(query))
              console.log("done loading org route")
              return response
            },
            lazy: () => import("../routes/organizations/organization"),
            children: [
              {
                path: "advisors",
                element: <Outlet />,
                children: [
                  {
                    path: ":advisorId",
                    loader: async ({ params }) => {
                      if (!isAuthenticated()) {
                        return null
                      }
                      const query = organizationAdvisorQuery({
                        organizationId: params.organizationId as string,
                        advisorId: params.advisorId as string,
                      })
                      const existingData = queryClient.getQueryData(
                        query.queryKey
                      )
                      const response =
                        existingData || (await queryClient.fetchQuery(query))
                      console.log("done loading advisor route")
                      return response
                    },
                    lazy: () =>
                      import(
                        "../routes/organizations/organization/advisors/advisor"
                      ),
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
])
