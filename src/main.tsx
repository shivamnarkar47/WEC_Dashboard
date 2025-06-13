import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
  RouterProvider,
  createRoute,
  createRootRoute,
  createRouter,
} from "@tanstack/react-router";
import Home from "./pages/Home";
import About from "./pages/About";
import Index from "./pages/Root";
import { Schedule } from "./pages/Schedule";
import { RaceDialog } from "./components/RaceDialog";

const rootRoute = createRootRoute({
  component: Index,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: About,
});

const liveTimingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/livetiming",
  component: RaceDialog,
});

const schedule = createRoute({
  getParentRoute: () => rootRoute,
  path: "/schedule",
  component: Schedule,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  aboutRoute,
  liveTimingRoute,
  schedule,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
