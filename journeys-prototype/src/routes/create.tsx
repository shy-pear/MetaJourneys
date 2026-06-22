import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/create")({
  head: () => ({ meta: [{ title: "Create · Glimpse" }] }),
  component: () => <Outlet />,
});