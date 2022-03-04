import { useMessagePresets } from "./hooks/useMessagePresets";
import { Layout } from "./components/Layout";
import { MessagePreset } from "./components/MessagePreset";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { validIcon, invalidIcon } from "./components/TweetInput";
import { useState } from "react";

export default function Presets() {
  const {
    messagePresetsQuery,
    addMessagePresetMutation,
    removeMessagePresetMutation,
    updateMessagePresetMutation,
  } = useMessagePresets();

  const [isEdited, setIsEdited] = useState(false);
  const messagePresets = messagePresetsQuery.data || [];
  const isLoading =
    messagePresetsQuery.isLoading ||
    addMessagePresetMutation.isLoading ||
    removeMessagePresetMutation.isLoading ||
    updateMessagePresetMutation.isLoading;

  const isSuccess =
    (messagePresetsQuery.isSuccess ||
      messagePresetsQuery.isIdle ||
      messagePresetsQuery.isLoading) &&
    (addMessagePresetMutation.isSuccess ||
      addMessagePresetMutation.isIdle ||
      addMessagePresetMutation.isLoading) &&
    (removeMessagePresetMutation.isSuccess ||
      removeMessagePresetMutation.isIdle ||
      removeMessagePresetMutation.isLoading) &&
    (updateMessagePresetMutation.isSuccess ||
      updateMessagePresetMutation.isIdle ||
      updateMessagePresetMutation.isLoading);

  return (
    <Layout>
      <div className="container px-5 mx-auto text-center">
        <div className="bg-gray-900 shadow-md rounded-lg p-8 flex flex-col">
          <h2 className="flex gap-2 justify-center content-center text-white text-md md:text-lg mb-8 font-medium title-font">
            Message Presets
            {isLoading ? <LoadingSpinner /> : null}
            {isEdited ? (isSuccess ? validIcon : invalidIcon) : null}
          </h2>
          {messagePresets.map((messagePreset) => (
            <MessagePreset
              key={messagePreset.id}
              messagePreset={messagePreset}
              isEdited={isEdited}
              setIsEdited={setIsEdited}
            />
          ))}
          <button
            type="button"
            onClick={() => addMessagePresetMutation.mutate("edit me")}
            className="flex mx-auto mt-8 text-white bg-indigo-500 hover:bg-indigo-600 border-0 py-2 px-8 focus:outline-none rounded text-md md:text-lg"
          >
            New message preset
          </button>
        </div>
      </div>
    </Layout>
  );
}
