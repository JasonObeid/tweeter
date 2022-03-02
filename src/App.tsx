import { Routes, Route } from "react-router-dom";
import { Home } from "./components/Home";
import { TwitterLogin } from "./components/TwitterLogin";
import LogRocket from "logrocket";
import { Login } from "./components/Login";
import { Header } from "./components/Header";
import { TwitterAccounts } from "./components/TwitterAccounts";
import "./App.css";
import { useAuthSession } from "./components/useAuthSession";

if (import.meta.env.PROD) {
  LogRocket.init("ecxlpy/tweeter");
}

export interface RouteDetail {
  path: string;
  label: string;
  element: null | React.ReactNode;
  showNav: boolean;
}

export default function App() {
  const { session } = useAuthSession();

  const unprotectedRoutes: RouteDetail[] = [
    {
      path: "/login",
      label: "Login",
      element: <Login />,
      showNav: false,
    },
  ];
  const protectedRoutes: RouteDetail[] = [
    {
      path: "/",
      label: "Home",
      element: <Home />,
      showNav: true,
    },
    {
      path: "/twitterAccounts",
      label: "Twitter Accounts",
      element: <TwitterAccounts />,
      showNav: true,
    },
    {
      path: "/authenticate",
      label: "Authenticate",
      element: <TwitterLogin />,
      showNav: false,
    },
  ];

  const availableRoutes = [...unprotectedRoutes, ...protectedRoutes];
  //   session === null || session.user === null
  //     ? unprotectedRoutes
  //     : protectedRoutes;

  const navLinks = availableRoutes.filter((route) => route.showNav);

  return (
    <div className="container-grid flex flex-1 flex-col font-sans text-sm md:text-base">
      {session ? <Header routes={navLinks} className="header" /> : null}
      <main className="body text-gray-400 bg-gray-700 body-font py-4 px-2 sm:p-6 md:p-8 w-screen">
        {!session ? (
          <Login />
        ) : (
          <Routes>
            {unprotectedRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
            {session
              ? protectedRoutes.map((route) => (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={route.element}
                  />
                ))
              : null}
          </Routes>
        )}
      </main>
      {/* <Footer className="footer" /> */}
    </div>
  );
}
