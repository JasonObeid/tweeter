import { useState, useEffect } from "react";
import {
  TwitterAuthUser,
  useTwitterAccounts,
} from "./hooks/useTwitterAccounts";
import { AccountSelector } from "./components/AccountSelector";
import { TweetInput } from "./components/TweetInput";
import { Layout } from "./components/Layout";

export default function Home() {
  const { twitterAccountsQuery } = useTwitterAccounts();
  const [users, setUsers] = useState<TwitterAuthUser[]>([]);

  function selectUser(userId: string) {
    const newUsers = [...users];
    const currentUser = newUsers.find((user) => user.id === userId);
    if (currentUser !== undefined) {
      currentUser.is_selected = !currentUser.is_selected;
      setUsers(newUsers);
    }
  }

  useEffect(() => {
    const accountData = twitterAccountsQuery.data || [];
    const twitterAuthUsers = accountData.map((user) => {
      const newUser: TwitterAuthUser = { ...user, is_selected: false };
      return newUser;
    });
    setUsers(twitterAuthUsers);
    if (twitterAccountsQuery.data === undefined) {
      setUsers([]);
    } else {
      setUsers(twitterAccountsQuery.data);
    }
  }, [twitterAccountsQuery.data]);

  const selectedUsers = users.filter((user) => user.is_selected);

  return (
    <Layout>
      <div className="container px-5 mx-auto text-center">
        <TweetInput selectedUsers={selectedUsers} />
        <AccountSelector
          users={users}
          selectedUsers={selectedUsers}
          selectUser={selectUser}
          isLoading={twitterAccountsQuery.isLoading}
        />
      </div>
    </Layout>
  );
}
