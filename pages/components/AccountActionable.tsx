import React from "react";
import { EngagementType } from "../home";
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
        className={`flex sm:w-56 sm:m-auto mb-6 sm:mb-6 content-center ${
          isSelected ? "pl-3 border-l-2 border-l-indigo-500" : ""
        }`}
      >
        <h2 className="text-white flex flex-1">{user.username}</h2>
        <input
          type="checkbox"
          // disabled={true}
          checked={isSelected}
          value={isSelected.toString()}
          className="text-white hover:cursor-pointer self-center"
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
