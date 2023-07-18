import { Outlet, createBrowserRouter } from "react-router-dom"
import { Component as ApplicationRoute } from "../routes/application"
import IndexRoute from "../routes/index/Page"
import SessionRoute from "@/components/routing/routes/SessionRoute"
import { appStore } from "@/stores"
import { advisorQuery, organizationQuery } from "@/data"
import { isAuthenticatedAtom } from "@/stores/auth"
import { queryClient } from "../utils/react-query"
import { ErrorBoundary } from "../components/routing/ErrorBoundary"

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
              if (!appStore.get(isAuthenticatedAtom)) {
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
                      console.log("loading advisor route")
                      if (!appStore.get(isAuthenticatedAtom)) {
                        return null
                      }
                      const query = advisorQuery(
                        params.organizationId as string,
                        params.advisorId as string
                      )
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
