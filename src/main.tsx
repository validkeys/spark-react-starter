import React from "react"
import ReactDOM from "react-dom/client"
import { RouterProvider } from "react-router-dom"
import "./styles/index.css"
import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { queryClient } from "./utils/react-query"
import { router } from "./router"
import { ErrorBoundary } from "react-error-boundary"
import { ToastContainer } from "react-toastify"
import { IntlProvider } from "react-intl"
import "react-toastify/dist/ReactToastify.css"

import { worker } from "./mocks/browser"
worker.start().catch((err) => {
  console.log("problem starting worker", err)
})

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <IntlProvider locale={navigator.language}>
      <ErrorBoundary
        fallback={<div>App Level ErrorBoundary: Something went wrong</div>}
      >
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <ReactQueryDevtools />
        </QueryClientProvider>
        <ToastContainer />
      </ErrorBoundary>
    </IntlProvider>
  </React.StrictMode>
)
