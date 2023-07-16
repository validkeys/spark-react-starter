import React, { ReactNode } from "react"
import ReactDOM from "react-dom/client"
import { RouterProvider, useRouteError } from "react-router-dom"
import "./styles/index.css"
import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { Provider } from "jotai"
import { queryClientAtom } from "jotai-tanstack-query"
import { useHydrateAtoms } from "jotai/utils"
import { appStore } from "./stores"
import { DevTools as JotaiDevtools } from "jotai-devtools"
import { queryClient } from "./utils/react-query"
import { router } from "./router"

// import { worker } from "./mocks/browser"
// worker.start().catch((err) => {
//   console.log("problem starting worker", err)
// })

// const ErrorBoundary = () => {
//   let error = useRouteError() as Error
//   return (
//     <div className="text-red-500">
//       <pre>{error.message}</pre>
//     </div>
//   )
// }

const HydrateAtoms = ({ children }: { children: ReactNode }) => {
  useHydrateAtoms([[queryClientAtom, queryClient]])
  return children
}

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
