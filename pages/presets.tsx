import { useMessagePresets } from "./hooks/useMessagePresets";
import { Layout } from "./components/Layout";
import { MessagePreset } from "./components/MessagePreset";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { validIcon, invalidIcon } from "./components/TweetInput";
import { useState } from "react";

import EnforceAuthenticated from "./components/EnforceAuthenticated";

export const getServerSideProps = EnforceAuthenticated();

export default function Presets() {
  const {
    messagePresetsQuery,
    addMessagePresetMutation,
    removeMessagePresetMutation,
    updateMessagePresetMutation,
  } = useMessagePresets();

  const [isEdited, setIsEdited] = useState(false);
  const messagePresets = messagePresetsQuery.data ?? [];
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
      <div className="container mx-auto px-5 text-center">
        <div className="flex flex-col rounded-lg bg-gray-900 p-8 shadow-md">
          <h2 className="text-md title-font mb-8 flex content-center justify-center gap-2 font-medium text-white md:text-lg">
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
            className="text-md mx-auto mt-8 flex rounded border-0 bg-indigo-500 py-2 px-8 text-white hover:bg-indigo-600 focus:outline-none md:text-lg"
          >
            New message preset
          </button>
        </div>
      </div>
    </Layout>
  );
}
