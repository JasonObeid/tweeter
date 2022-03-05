import React from "react";
import { EngagementType } from "../config/types";
import { TwitterAuthUser } from "../hooks/useTwitterAccounts";
import { MessagePresetDropdown } from "./MessagePresetDropdown";

export function AccountActionable({
  user,
  selectUser,
  updateUserReplyText,
  engagementType,
}: {
  user: TwitterAuthUser;
  selectUser: (id: string) => void;
  engagementType: EngagementType;
  updateUserReplyText: (userId: string, newMessage: string) => void;
}) {
  const isSelected = user.is_selected || false;

  return (
    <>
      <button
        type="button"
        onClick={() => selectUser(user.id)}
        key={user.id}
        className={`mb-6 flex content-center sm:m-auto sm:mb-6 sm:w-56 ${
          isSelected ? "border-l-2 border-l-indigo-500 pl-3" : ""
        }`}
      >
        <h2 className="flex flex-1 text-white">{user.username}</h2>
        <input
          type="checkbox"
          // disabled={true}
          checked={isSelected}
          value={isSelected.toString()}
          className="self-center text-white hover:cursor-pointer"
          onChange={() => {}}
        />
      </button>
      {engagementType === "reply" && user.is_selected ? (
        <MessagePresetDropdown
          user={user}
          updateUserReplyText={updateUserReplyText}
        />
      ) : null}
    </>
  );
}
