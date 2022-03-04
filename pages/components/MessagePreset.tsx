import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { MessagePresets, useMessagePresets } from "../hooks/useMessagePresets";
import { LoadingSpinner } from "./LoadingSpinner";

export function MessagePreset({
  messagePreset,
  isEdited,
  setIsEdited,
}: {
  messagePreset: MessagePresets;
  isEdited: boolean;
  setIsEdited: Dispatch<SetStateAction<boolean>>;
}) {
  const [message, setMessage] = useState(messagePreset.message);
  const [isEditing, setIsEditing] = useState(false);
  const { updateMessagePresetMutation, removeMessagePresetMutation } =
    useMessagePresets();

  useEffect(() => {
    if (messagePreset.message === "edit me") {
      setIsEditing(true);
    }
  }, [messagePreset.message]);

  return (
    <div
      key={messagePreset.id}
      className="flex sm:w-56 sm:m-auto mb-6 sm:mb-6 content-center justify-end gap-7"
    >
      {isEditing ? (
        <textarea
          id="message"
          name="message"
          value={message}
          onChange={(event) => {
            setMessage(event.target.value);
          }}
          className="w-full text-left bg-gray-800 rounded border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900 h-32 text-base outline-none text-gray-100 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
        ></textarea>
      ) : updateMessagePresetMutation.isLoading ? (
        <LoadingSpinner />
      ) : (
        <p className="text-white w-full text-left">{messagePreset.message}</p>
      )}
      <div className="flex gap-4 content-center">
        <button
          className="text-white"
          onClick={() => {
            setIsEditing((isEditing) => !isEditing);
            if (isEditing === true) {
              setIsEdited(true);
              if (message !== messagePreset.message) {
                updateMessagePresetMutation.mutate({
                  id: messagePreset.id,
                  newMessage: message,
                });
              }
              setTimeout(() => setIsEdited(false), 2500);
            }
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            {isEditing ? (
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            ) : (
              <>
                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                <path
                  fillRule="evenodd"
                  d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                  clipRule="evenodd"
                />
              </>
            )}
          </svg>
        </button>
        <button
          className="text-white"
          onClick={() => {
            setIsEdited(true);
            removeMessagePresetMutation.mutate(messagePreset.id);
            setTimeout(() => setIsEdited(false), 2500);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
