import { TwitterAuthUser } from "../hooks/useTwitterAccounts";

export function AccountActionable({
  user,
  selectUser,
}: {
  user: TwitterAuthUser;
  selectUser: (id: string) => void;
}) {
  const isSelected = user.is_selected || false;

  return (
    <button
      type="button"
      onClick={() => selectUser(user.id)}
      key={user.id}
      className={`flex w-36 sm:w-56 mb-6 m-auto content-center ${
        isSelected ? " pl-2 border-l-2 border-l-indigo-500" : ""
      }`}
    >
      <h2 className="text-white flex flex-1">{user.username}</h2>
      <input
        type="checkbox"
        checked={isSelected}
        value={isSelected.toString()}
        className="text-white hover:cursor-pointer self-center"
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onChange={() => {}}
      />
    </button>
  );
}
