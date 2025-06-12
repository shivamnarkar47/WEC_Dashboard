import { Link, useLocation } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { Icons } from "./icon";
import { ModeToggle } from "./mode-toggle";

export function Navbar() {
  const location = useLocation();

  const routes = [
    {
      href: "/",
      label: "Home",
      icon: <Icons.gauge className="h-4 w-4" />,
    },
    {
      href: "/about",
      label: "About",
      icon: <Icons.info className="h-4 w-4" />,
    },
    {
      href: "/livetiming",
      label: "Live Timing",
      icon: <Icons.clock className="h-4 w-4" />,
    },
    {
      href: "/schedule",
      label: "Schedule",
      icon: <Icons.calendar className="h-4 w-4" />,
    },
  ];

  return (
    <nav className="border-b bg-background">
      <div className="flex h-16 items-center justify-between  px-4">
        <div className="flex items-center gap-2">
          <Icons.racingHelmet className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold tracking-tight">RaceDash</span>
        </div>

        <div className="hidden md:flex items-center gap-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              to={route.href}
              className={cn(
                "flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors rounded-lg",
                location.pathname === route.href
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-background hover:bg-foreground",
              )}
            >
              {route.icon}
              {route.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium  transition-colors hover:text-background hover:bg-foreground border border-input h-10 w-10">
            <ModeToggle />
          </button>
        </div>
      </div>
    </nav>
  );
}
