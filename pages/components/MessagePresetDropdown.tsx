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
  const messagePresets = messagePresetsQuery.data || [];

  return (
    <div className="w-52 mx-auto sm:w-56 sm:m-auto sm:mb-10 mb-10">
      <div className="flex justify-between content-center">
        <button
          onClick={() => setIsOpen((isOpen) => !isOpen)}
          className="flex flex-1 text-ellipsis self-center z-10 p-2 text-gray-700 bg-white border border-transparent rounded-md dark:text-white focus:border-blue-500 focus:ring-opacity-40 dark:focus:ring-opacity-40 focus:ring-blue-300 dark:focus:ring-blue-400 focus:ring dark:bg-gray-800 focus:outline-none"
        >
          {user.reply_text}
          <svg
            className="w-5 h-5 text-gray-800 dark:text-white ml-auto"
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
        <div className="absolute w-56  z-20 py-2 bg-white rounded-md shadow-xl dark:bg-gray-800">
          {messagePresets.map((messagePreset) => (
            <button
              key={`dropdown-option-${messagePreset.id}`}
              className={`flex flex-1 w-full text-ellipsis px-4 py-3 text-sm text-gray-600 capitalize transition-colors duration-200 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white ${
                messagePreset.message === user.reply_text
                  ? "ml-2 pl-3 border-l-2 border-l-indigo-500"
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
