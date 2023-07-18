import React from "react"
import ReactDOM from "react-dom/client"
import { RouterProvider } from "react-router-dom"
import "./styles/index.css"
import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { Provider } from "jotai"
import { appStore } from "./stores"
import { DevTools as JotaiDevtools } from "jotai-devtools"
import { queryClient } from "./utils/react-query"
import { router } from "./router"
import { ErrorBoundary } from "react-error-boundary"
import { HydrateAtoms } from "./components/jotai/HydrateAtoms"

import { worker } from "./mocks/browser"
worker.start().catch((err) => {
  console.log("problem starting worker", err)
})

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary
      fallback={<div>App Level ErrorBoundary: Something went wrong</div>}
    >
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
    </ErrorBoundary>
  </React.StrictMode>
)
