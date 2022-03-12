import { GetServerSideProps } from "next";
import { client } from "../config/supabaseClient";

const EnforceAuthenticated: (
  inner?: GetServerSideProps,
) => GetServerSideProps = (inner) => {
  return async (context) => {
    const { req } = context;
    const { user } = await client.auth.api.getUserByCookie(req);

    if (user === null) {
      const destination = req.url?.includes("/login")
        ? undefined
        : !req.url?.includes("_next/data")
        ? `/login?from=${req.url}`
        : "/login";

      if (destination !== undefined) {
        return {
          props: {},
          redirect: { destination },
        };
      }

      return {
        props: {},
      };
    } else {
      const destination =
        !req.url?.includes("_next/data") && req.url === "/login"
          ? "/"
          : undefined;
      if (inner) {
        return inner(context);
      }
      if (destination !== undefined) {
        return {
          props: {
            user,
          },
          redirect: { destination },
        };
      }

      return {
        props: {
          user,
        },
      };
    }
  };
};

export default EnforceAuthenticated;
