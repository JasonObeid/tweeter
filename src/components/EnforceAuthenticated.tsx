import { GetServerSideProps } from "next";
import { client } from "../config/supabaseClient";

const EnforceAuthenticated: (
  inner?: GetServerSideProps,
) => GetServerSideProps = (inner) => {
  return async (context) => {
    const { req } = context;
    const { user } = await client.auth.api.getUserByCookie(req);

    if (user === null) {
      const redirectURI =
        req.url !== "/" && !req.url?.includes("_next/data")
          ? `/login?from=${req.url}`
          : "/login";
      return {
        props: {},
        redirect: { destination: redirectURI },
      };
    }

    if (inner) {
      return inner(context);
    }

    return {
      props: {
        user,
      },
    };
  };
};

export default EnforceAuthenticated;
