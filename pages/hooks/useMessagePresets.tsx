import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  PostgrestResponse,
  PostgrestSingleResponse,
} from "@supabase/supabase-js";

import { client } from "../config/supabaseClient";

export interface MessagePresets {
  id: string;
  message: string;
}

export function getPrefilledReplies(
  count: number,
  messagePresets: MessagePresets[],
) {
  let messagePresetIndex = 0;
  const replies: string[] = new Array(count);
  for (let i = 0; i < replies.length; i++) {
    if (messagePresetIndex < messagePresets.length) {
      replies[i] = messagePresets[messagePresetIndex].message;
    } else {
      messagePresetIndex = 0;
      replies[i] = messagePresets[0].message;
    }
    messagePresetIndex += 1;
  }

  return replies;
}

export async function getMessagePresets() {
  const { data, error, status }: PostgrestResponse<MessagePresets> =
    await client.from("message_presets").select(`message,id`);

  if (error && status !== 406) {
    throw error;
  }

  if (data === null) {
    throw new Error("retrieved message_presets was null");
  }
  return data;
}

export async function updateMessagePreset({
  id,
  newMessage,
}: {
  id: string;
  newMessage: string;
}) {
  const { data, error, status }: PostgrestSingleResponse<MessagePresets> =
    await client
      .from("message_presets")
      .update({ message: newMessage })
      .eq("id", id)
      .single();

  if (error && status !== 406) {
    throw error;
  }

  if (data === null) {
    throw new Error("updated message_presets was null");
  }
  return data;
}

export async function removeMessagePreset(id: string) {
  const { data, error, status }: PostgrestSingleResponse<MessagePresets> =
    await client.from("message_presets").delete().eq("id", id).single();

  if (error && status !== 406) {
    throw error;
  }

  if (data === null) {
    throw new Error("deleted message_presets was null");
  }
  return data;
}

export async function addMessagePreset(message: string) {
  const { data, error, status }: PostgrestSingleResponse<MessagePresets> =
    await client.from("message_presets").insert({ message: message }).single();

  if (error && status !== 406) {
    throw error;
  }

  if (data === null) {
    throw new Error("updated message_presets was null");
  }
  return data;
}

export function useMessagePresets() {
  const queryClient = useQueryClient();

  const messagePresetsQuery = useQuery("messagePresets", getMessagePresets, {
    cacheTime: 5 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (data) => console.log(data),
  });

  const updateMessagePresetMutation = useMutation(updateMessagePreset, {
    mutationKey: "updateMessagePreset",
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
    onMutate: () => {
      setTimeout(() => queryClient.invalidateQueries("messagePresets"), 1500);
    },
  });

  const removeMessagePresetMutation = useMutation(removeMessagePreset, {
    mutationKey: "removeMessagePreset",
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
    onMutate: () => {
      setTimeout(() => queryClient.invalidateQueries("messagePresets"), 1500);
    },
  });

  const addMessagePresetMutation = useMutation(addMessagePreset, {
    mutationKey: "addMessagePreset",
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
    onMutate: () => {
      setTimeout(() => queryClient.invalidateQueries("messagePresets"), 1500);
    },
  });

  return {
    messagePresetsQuery,
    updateMessagePresetMutation,
    removeMessagePresetMutation,
    addMessagePresetMutation,
  };
}
