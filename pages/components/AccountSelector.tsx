import { TwitterAuthUser } from "../hooks/useTwitterAccounts";
import { AccountActionable } from "./AccountActionable";
import { Spinner } from "./Spinner";

export function AccountSelector({
  users,
  selectedUsers,
  selectUser,
  isLoading,
}: {
  users: TwitterAuthUser[];
  selectedUsers: TwitterAuthUser[];
  selectUser: (id: string) => void;
  isLoading: boolean;
}) {
  return (
    <div className="container px-5 mx-auto text-center">
      <div className="bg-gray-900 shadow-md rounded-lg p-8 flex flex-col">
        <h2 className="text-white text-md md:text-lg mb-8 font-medium flex justify-center gap-4 content-center">
          Twitter Accounts - {selectedUsers.length} of {users.length} selected{" "}
          {isLoading ? <Spinner /> : null}
        </h2>

        {users.map((user) => {
          return (
            <AccountActionable
              key={user.id}
              user={user}
              selectUser={selectUser}
            />
          );
        })}
      </div>
    </div>
  );
}
