import { EngagementType } from "../config/types";
import { TwitterAuthUser } from "../hooks/useTwitterAccounts";
import { AccountActionable } from "./AccountActionable";
import { LoadingSpinner } from "./LoadingSpinner";

export function AccountSelector({
  users,
  selectedUsers,
  selectUser,
  updateUserReplyText,
  isLoading,
  engagementType,
}: {
  users: TwitterAuthUser[];
  selectedUsers: TwitterAuthUser[];
  selectUser: (id: string) => void;
  updateUserReplyText: (userId: string, newMessage: string) => void;
  isLoading: boolean;
  engagementType: EngagementType;
}) {
  return (
    <div className="container mx-auto px-5 text-center">
      <form className="flex flex-col rounded-lg bg-gray-900 p-8 shadow-md">
        <h2 className="text-md mb-8 flex content-center justify-center gap-4 font-medium text-white md:text-lg">
          Twitter Accounts - {selectedUsers.length} of {users.length} selected{" "}
          {isLoading ? <LoadingSpinner /> : null}
        </h2>

        {users.map((user) => {
          return (
            <AccountActionable
              key={user.id}
              user={user}
              selectUser={selectUser}
              engagementType={engagementType}
              updateUserReplyText={updateUserReplyText}
            />
          );
        })}
      </form>
    </div>
  );
}
