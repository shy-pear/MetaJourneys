import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/journey/$id")({
  component: () => <Outlet />,
});