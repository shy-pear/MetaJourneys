import { RouterProvider, createRouter, createHashHistory } from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";
import { routeTree } from "./routeTree.gen";

const queryClient = new QueryClient();

// Hash history so routing works when the built app is embedded in an iframe
// (e.g. inside the Streamlit dashboard via st.components.v1.html / srcdoc).
const router = createRouter({
  routeTree,
  history: createHashHistory(),
  context: {
    queryClient,
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
