import { Outlet, createBrowserRouter } from "react-router-dom"
import { Component as ApplicationRoute } from "../routes/application"
import IndexRoute from "../routes/index/Page"
import ProtectedRoute from "../utils/protected-route"
import { appStore } from "@/stores"
import {
  currentOrganizationIdAtom,
  organizationQuery,
} from "@/routes/organizations/organization/store"
import {
  currentAdvisorIdAtom,
  advisorQuery,
} from "@/routes/organizations/organization/advisors/advisor/store"
import { isAuthenticatedAtom } from "@/stores/auth"
import { queryClient } from "../utils/react-query"

export const router = createBrowserRouter([
  {
    path: "/",
    Component: ApplicationRoute,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <IndexRoute />
          </ProtectedRoute>
        ),
      },
      {
        path: "login",
        lazy: () => import("../routes/login"),
      },
      {
        path: "organizations",
        element: (
          <ProtectedRoute>
            <Outlet />
          </ProtectedRoute>
        ),
        children: [
          {
            path: ":organizationId",
            loader: async ({ params }) => {
              appStore.set(
                currentOrganizationIdAtom,
                params.organizationId as string
              )

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
                      appStore.set(
                        currentAdvisorIdAtom,
                        params.advisorId as string
                      )
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
