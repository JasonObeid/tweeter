import { useState, useEffect } from "react";
import {
  TwitterAuthUser,
  useTwitterAccounts,
} from "./hooks/useTwitterAccounts";
import { AccountSelector } from "./components/AccountSelector";
import { TweetInput } from "./components/TweetInput";
import { Layout } from "./components/Layout";
import {
  getPrefilledReplies,
  useMessagePresets,
} from "./hooks/useMessagePresets";

export type EngagementType = "reply" | "retweet" | "like";

export default function Home() {
  const { twitterAccountsQuery } = useTwitterAccounts();
  const { messagePresetsQuery } = useMessagePresets();
  const [users, setUsers] = useState<TwitterAuthUser[]>([]);
  const [engagementType, setEngagementType] = useState<EngagementType>("like");

  function selectUser(userId: string) {
    const newUsers = [...users];
    const currentUser = newUsers.find((user) => user.id === userId);
    if (currentUser !== undefined) {
      currentUser.is_selected = !currentUser.is_selected;
      setUsers(newUsers);
    }
  }
  function updateUserReplyText(userId: string, newMessage: string) {
    const newUsers = [...users];
    const currentUser = newUsers.find((user) => user.id === userId);
    if (currentUser !== undefined) {
      currentUser.reply_text = newMessage;
      setUsers(newUsers);
    }
  }

  useEffect(() => {
    const messagePresets = messagePresetsQuery.data || [];
    const accountData = twitterAccountsQuery.data || [];
    if (accountData.length > 0 && messagePresets.length > 0) {
      const prefilledReplies = getPrefilledReplies(
        accountData.length,
        messagePresets,
      );
      const twitterAuthUsers = accountData.map((user, index) => {
        const newUser: TwitterAuthUser = {
          ...user,
          is_selected: false,
          reply_text: prefilledReplies[index],
        };
        return newUser;
      });
      setUsers(twitterAuthUsers);
    } else if (twitterAccountsQuery.data === undefined) {
      setUsers([]);
    } else {
      setUsers(twitterAccountsQuery.data);
    }
  }, [twitterAccountsQuery.data, messagePresetsQuery.data]);

  const selectedUsers = users.filter((user) => user.is_selected);

  return (
    <Layout>
      <div className="container px-5 mx-auto text-center">
        <TweetInput
          selectedUsers={selectedUsers}
          engagementType={engagementType}
          setEngagementType={setEngagementType}
        />
        <AccountSelector
          users={users}
          selectedUsers={selectedUsers}
          selectUser={selectUser}
          isLoading={twitterAccountsQuery.isLoading}
          engagementType={engagementType}
          updateUserReplyText={updateUserReplyText}
        />
      </div>
    </Layout>
  );
}
