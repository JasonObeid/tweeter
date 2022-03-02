import { Link, useLocation } from "react-router-dom";
import { RouteDetail } from "../App";

export function Header({
  routes,
  className,
}: {
  routes: RouteDetail[];
  className: string;
}) {
  const currentRoute = useLocation();
  const selectedStyles = "dark:text-gray-200 border-blue-500 text-gray-800";

  return (
    <header className={className}>
      <nav className="bg-white shadow dark:bg-gray-800">
        <div className="container flex items-center justify-center p-6 mx-auto text-gray-600 capitalize dark:text-gray-300">
          {routes.map((route) => {
            const isSelected = currentRoute.pathname === route.path;
            return (
              <Link
                key={`${route.path}-nav`}
                to={route.path}
                className={`border-b-2 hover:text-gray-800 transition-colors duration-200 transform dark:hover:text-gray-200 hover:border-blue-500 mx-1.5 sm:mx-6 ${
                  isSelected ? selectedStyles : "border-transparent"
                }`}
              >
                {route.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
