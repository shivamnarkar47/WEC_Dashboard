import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Outlet } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";

const Index = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
};

export default Index;
