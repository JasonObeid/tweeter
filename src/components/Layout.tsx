import { Header } from "./Header";
import styles from "./Layout.module.css";

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
    <div
      className={`${styles.containerGrid} flex flex-1 flex-col bg-gray-700 font-sans text-sm md:text-base`}
    >
      <Header routes={routes} className={styles.header} />
      <main
        className={`${styles.body} body-font w-screen py-4 px-2 text-gray-400 sm:p-6 md:p-8`}
      >
        {children}
      </main>
    </div>
  );
}
