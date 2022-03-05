import React from "react";
import { Header } from "./Header";
import "./Layout.module.css";

export interface RouteDetail {
  path: string;
  label: string;
}

export function Layout({ children }: { children: React.ReactNode }) {
  const routes: RouteDetail[] = [
    {
      path: "/",
      label: "Home",
    },
    {
      path: "/profiles",
      label: "Twitter Accounts",
    },
    {
      path: "/presets",
      label: "Preset Replies",
    },
  ];

  return (
    <div className="container-grid flex flex-1 flex-col font-sans text-sm md:text-base   bg-gray-700 ">
      <Header routes={routes} className="header" />
      <main className="body text-gray-400 body-font py-4 px-2 sm:p-6 md:p-8 w-screen">
        {children}
      </main>
    </div>
  );
}
