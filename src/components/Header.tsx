import Link from "next/link";
import { useRouter } from "next/router";
import { RouteDetail } from "./Layout";

export function Header({
  routes,
  className,
}: {
  routes: RouteDetail[];
  className: string;
}) {
  const currentRoute = useRouter();
  const selectedStyles = "text-gray-200 border-blue-500 ";

  return (
    <header className={className}>
      <nav className="shadow bg-gray-800">
        <div className="container flex items-center justify-center p-6 mx-auto capitalize text-gray-300">
          {routes.map((route) => {
            const isSelected = currentRoute.pathname === route.path;
            return (
              <Link key={`${route.path}-nav`} href={route.path} passHref>
                <a
                  className={`border-b-2 transition-colors duration-200 transform hover:text-gray-200 hover:border-blue-500 mx-1.5 sm:mx-6 ${
                    isSelected ? selectedStyles : "border-transparent"
                  }`}
                >
                  {route.label}
                </a>
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
