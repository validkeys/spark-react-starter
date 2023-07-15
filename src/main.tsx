import React, { ReactNode } from "react"
import ReactDOM from "react-dom/client"
import ApplicationRoute from "./routes/application"
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  useRouteError,
} from "react-router-dom"
import LoginRoute from "./routes/login"
import IndexRoute from "./routes/index"
import "./styles/index.css"
import ProtectedRoute from "./utils/protected-route"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { worker } from "./mocks/browser"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { Provider } from "jotai"
import { queryClientAtom } from "jotai-tanstack-query"
import { useHydrateAtoms } from "jotai/utils"
import { appStore } from "./stores"
import { DevTools as JotaiDevtools } from "jotai-devtools"
import TestRoute from "./routes/test"
import {
  organizationQuery,
  currentOrganizationIdAtom,
} from "./stores/organization"
import OrganizationRoute from "./routes/organizations/organization"
import { advisorQuery, currentAdvisorIdAtom } from "./stores/advisor"
import AdvisorRoute from "./routes/organizations/organization/advisors/advisor"

const queryClient = new QueryClient()

// worker.start().catch((err) => {
//   console.log("problem starting worker", err);
// });

const ErrorBoundary = () => {
  let error = useRouteError() as Error
  return (
    <div className="text-red-500">
      <pre>{error.message}</pre>
    </div>
  )
}

const HydrateAtoms = ({ children }: { children: ReactNode }) => {
  useHydrateAtoms([[queryClientAtom, queryClient]])
  return children
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <ApplicationRoute />,
    children: [
      {
        path: "test",
        element: <TestRoute />,
        errorElement: <ErrorBoundary />,
      },
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
        element: <LoginRoute />,
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
              console.log("loading org route")
              appStore.set(
                currentOrganizationIdAtom,
                params.organizationId as string
              )
              const query = organizationQuery(params.organizationId as string)
              const existingData = queryClient.getQueryData(query.queryKey)
              const response =
                existingData || (await queryClient.fetchQuery(query))
              console.log("done loading org route")
              return response
            },
            element: <OrganizationRoute />,
            children: [
              {
                path: "advisors",
                element: (
                  <div>
                    <div>Advisors Route</div>
                    <div>
                      <Outlet />
                    </div>
                  </div>
                ),
                children: [
                  {
                    path: ":advisorId",
                    loader: async ({ params }) => {
                      console.log("loading advisor route")
                      appStore.set(
                        currentAdvisorIdAtom,
                        params.advisorId as string
                      )
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
                    element: <AdvisorRoute />,
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

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={appStore}>
        <HydrateAtoms>
          <RouterProvider router={router} />
          <JotaiDevtools store={appStore} />
          <ReactQueryDevtools />
        </HydrateAtoms>
      </Provider>
      <JotaiDevtools store={appStore} />
    </QueryClientProvider>
  </React.StrictMode>
)
