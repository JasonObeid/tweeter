import { EngagementType } from "..";
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
    <div className="container px-5 mx-auto text-center">
      <div className="bg-gray-900 shadow-md rounded-lg p-8 flex flex-col">
        <h2 className="text-white text-md md:text-lg mb-8 font-medium flex justify-center gap-4 content-center">
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
      </div>
    </div>
  );
}
