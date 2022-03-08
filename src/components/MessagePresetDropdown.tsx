import { useState } from "react";
import { useMessagePresets } from "../hooks/useMessagePresets";
import { TwitterAuthUser } from "../hooks/useTwitterAccounts";

export function MessagePresetDropdown({
  user,
  updateUserReplyText,
}: {
  user: TwitterAuthUser;
  updateUserReplyText: (userId: string, newMessage: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { messagePresetsQuery } = useMessagePresets();
  const messagePresets = messagePresetsQuery.data ?? [];

  return (
    <div className="mx-auto mb-10 w-52 sm:m-auto sm:mb-10 sm:w-56">
      <div className="flex content-center justify-between">
        <button
          onClick={() => setIsOpen((isOpen) => !isOpen)}
          className="z-10 flex flex-1 self-center text-ellipsis rounded-md border border-transparent bg-white p-2 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-400 dark:focus:ring-opacity-40"
        >
          {user.reply_text}
          <svg
            className="ml-auto h-5 w-5 text-gray-800 dark:text-white"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      {isOpen ? (
        <div className="absolute z-20  w-56 rounded-md bg-white py-2 shadow-xl dark:bg-gray-800">
          {messagePresets.map((messagePreset) => (
            <button
              key={`dropdown-option-${messagePreset.id}`}
              className={`flex w-full flex-1 px-4 py-3 text-sm capitalize text-gray-600 transition-colors duration-200 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white ${
                messagePreset.message === user.reply_text
                  ? "ml-2 border-l-2 border-l-indigo-500 pl-3"
                  : ""
              }`}
              onClick={() => {
                updateUserReplyText(user.id, messagePreset.message);
                setIsOpen(false);
              }}
            >
              {messagePreset.message}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
