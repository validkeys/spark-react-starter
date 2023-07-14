import React, { ReactNode } from "react";
import ReactDOM from "react-dom/client";
import ApplicationRoute from "./routes/application";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginRoute from "./routes/login";
import "./styles/index.css";
import ProtectedRoute from "./utils/protected-route";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { worker } from "./mocks/browser";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider } from "jotai";
import { queryClientAtom } from "jotai-tanstack-query";
import { useHydrateAtoms } from "jotai/utils";
import { appStore } from "./stores";
import { DevTools as JotaiDevtools } from "jotai-devtools";

const queryClient = new QueryClient();

worker.start().catch((err) => {
  console.log("problem starting worker", err);
});

const HydrateAtoms = ({ children }: { children: ReactNode }) => {
  useHydrateAtoms([[queryClientAtom, queryClient]]);
  return children;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <ApplicationRoute />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <div>Index Route!</div>
          </ProtectedRoute>
        ),
      },
      {
        path: "login",
        element: <LoginRoute />,
      },
    ],
  },
]);

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
);
