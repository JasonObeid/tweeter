import Link from "next/link";
import useSWR from "swr";
import { Auth, Card, Typography, Space, Button, Icon } from "@supabase/ui";
import { client } from "./config/supabaseClient";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const fetcher = (url: string, token: string) =>
  fetch(url, {
    method: "GET",
    headers: new Headers({ "Content-Type": "application/json", token }),
    credentials: "same-origin",
  }).then((res) => res.json());

const Index = () => {
  const router = useRouter();
  const { user, session } = Auth.useUser();
  const { data, error } = useSWR(
    session ? ["/api/getUser", session.access_token] : null,
    fetcher,
  );
  const [authView, setAuthView] = useState<ViewType>("sign_in");

  useEffect(() => {
    const { data: authListener } = client.auth.onAuthStateChange(
      (event, session) => {
        if (event === "PASSWORD_RECOVERY") setAuthView("update_password");
        if (event === "USER_UPDATED")
          setTimeout(() => setAuthView("sign_in"), 1000);
        // Send session to /api/auth route to set the auth cookie.
        // NOTE: this is only needed if you're doing SSR (getServerSideProps)!
        fetch("/api/auth", {
          method: "POST",
          headers: new Headers({ "Content-Type": "application/json" }),
          credentials: "same-origin",
          body: JSON.stringify({ event, session }),
        }).then((res) => res.json());
      },
    );

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) {
      router.push("/home");
    }
  }, [router, user]);

  console.log(error);
  const View = () => {
    if (!user)
      return (
        <Space direction="vertical" size={8}>
          <div>
            <Typography.Title level={3}>Welcome to Tweeter</Typography.Title>
          </div>
          <Auth supabaseClient={client} view={authView} />
        </Space>
      );

    return (
      <Space direction="vertical" size={6}>
        {authView === "update_password" && (
          <Auth.UpdatePassword supabaseClient={client} />
        )}
        {user && (
          <>
            <Typography.Text>You are signed in</Typography.Text>
            <Typography.Text strong>Email: {user.email}</Typography.Text>

            <Button
              icon={<Icon type="LogOut" />}
              type="outline"
              onClick={() => client.auth.signOut()}
            >
              Log out
            </Button>
            {error && (
              <Typography.Text danger>Failed to fetch user!</Typography.Text>
            )}
            {data && !error ? (
              <>
                <Typography.Text type="success">
                  User data retrieved server-side (in API route):
                </Typography.Text>

                <Typography.Text>
                  <pre>{JSON.stringify(data, null, 2)}</pre>
                </Typography.Text>
              </>
            ) : (
              <div>Loading...</div>
            )}

            <Typography.Text>
              <Link href="/profile">
                <a>SSR example with getServerSideProps</a>
              </Link>
            </Typography.Text>
          </>
        )}
      </Space>
    );
  };

  return (
    <div style={{ maxWidth: "420px", margin: "96px auto" }}>
      <Card>
        <View />
      </Card>
    </div>
  );
};

export default Index;
