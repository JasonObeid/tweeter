import { useEffect, useState } from "react";
import { useCheckTweetId } from "../api/useCheckTweetId";
import { useLikeTweet } from "../api/useLikeTweet";
import { useReplyTweetMutation } from "../api/useReplyTweet";
import { useRetweet } from "../api/useRetweet";
import { TwitterAuthUser, useTwitterAccounts } from "../api/useTwitterAccounts";
import { Error } from "./Error";
import { Spinner } from "./Spinner";
import { Success } from "./Success";

export type EngagementType = "reply" | "retweet" | "like";

export const invalidIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-red-800 self-center"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <title>invalid</title>
    <path
      fillRule="evenodd"
      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
      clipRule="evenodd"
    />
  </svg>
);

export const validIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-green-800 self-center"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <title>valid</title>
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
);

export const replyIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-2"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

export const likeIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-2"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
      clipRule="evenodd"
    />
  </svg>
);

export const retweetIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-2"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
      clipRule="evenodd"
    />
  </svg>
);

export function TweetInput({
  selectedUsers,
}: {
  selectedUsers: TwitterAuthUser[];
}) {
  const [engagementType, setEngagementType] = useState<EngagementType>("like");
  const [replyText, setReplyText] = useState("");

  const { checkTweetIdQuery, tweetId, setTweetId, isTweetIdNotCheckable } =
    useCheckTweetId();
  const { likeMutation } = useLikeTweet();
  const { retweetMutation } = useRetweet();
  const { replyTweetMutation } = useReplyTweetMutation();

  function engage() {
    if (engagementType === "like") {
      likeMutation.mutate({ tweetId, selectedUsers });
    } else if (engagementType === "retweet") {
      retweetMutation.mutate({ tweetId, selectedUsers });
    } else if (engagementType === "reply") {
      replyTweetMutation.mutate({ tweetId, selectedUsers, replyText });
    }
  }

  const buttonStyle =
    "rounded rounded-l:none sm:rounded-t border-l-2 sm:border-l-0 sm:border-b-2 mb-2 sm:mb-0 w-full sm:px-6 py-3 sm:w-1/2 justify-center sm:justify-start  font-medium inline-flex items-center leading-none tracking-wider";
  const selectedButtonStyle =
    buttonStyle + " border-indigo-500 text-white bg-gray-800";
  const unselectedButtonStyle =
    buttonStyle + " border-gray-800 hover:text-white";

  const isTweetIdChecked = checkTweetIdQuery.data !== undefined;
  const isTweetIdValid =
    checkTweetIdQuery.data !== undefined && checkTweetIdQuery.data.isValid;

  const isButtonDisabled = !(selectedUsers.length > 0 && true);

  return (
    <div className="container px-5 mx-auto text-center">
      <div className="bg-gray-900 shadow-md rounded-lg p-8 flex flex-col mb-8">
        <h2 className="text-white text-md md:text-lg mb-1 font-medium ">
          Tweet Engagement
        </h2>
        <p className="leading-relaxed mb-5">
          Paste the Tweet ID of the tweet you want to engage with.
        </p>
        <p className="leading-relaxed mb-5">
          For example, given a tweet URL like twitter.com/user/status/
          <strong>123456789</strong>, you would enter <strong>123456789</strong>
        </p>
        <div className="relative mb-4">
          <label
            htmlFor="tweet-url"
            className="flex justify-center content-center gap-2 leading-7 text-sm md:text-base text-gray-400 mb-2"
          >
            Tweet ID {checkTweetIdQuery.isLoading ? <Spinner /> : null}
            {isTweetIdChecked
              ? isTweetIdValid
                ? validIcon
                : invalidIcon
              : isTweetIdNotCheckable
              ? invalidIcon
              : null}
          </label>
          <input
            type="text"
            id="tweet-url"
            name="tweet-url"
            value={tweetId}
            onChange={(event) => {
              setTweetId(event.target.value);
            }}
            className={`w-full bg-gray-800 rounded border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out ${
              isTweetIdChecked
                ? isTweetIdValid
                  ? "border-green-700"
                  : "border-red-800"
                : isTweetIdNotCheckable
                ? "border-red-800"
                : ""
            }
            }`}
          />
        </div>
        <div className="flex sm:mx-auto flex-wrap sm:flex-nowrap mb-4 mt-2 md:mt-8">
          <button
            onClick={() => setEngagementType("retweet")}
            className={
              engagementType === "retweet"
                ? selectedButtonStyle
                : unselectedButtonStyle
            }
          >
            {retweetIcon}
            Retweet
          </button>
          <button
            onClick={() => setEngagementType("like")}
            className={
              engagementType === "like"
                ? selectedButtonStyle
                : unselectedButtonStyle
            }
          >
            {likeIcon}
            Like
          </button>
          <button
            onClick={() => setEngagementType("reply")}
            className={
              engagementType === "reply"
                ? selectedButtonStyle
                : unselectedButtonStyle
            }
          >
            {replyIcon}
            Reply
          </button>
        </div>
        {engagementType === "reply" ? (
          <div className="relative mb-4">
            <label
              htmlFor="message"
              className="leading-7 text-sm md:text-base text-gray-400"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={replyText}
              onChange={(event) => {
                setReplyText(event.target.value);
              }}
              className="w-full bg-gray-800 rounded border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900 h-32 text-base outline-none text-gray-100 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
            ></textarea>
          </div>
        ) : null}
        <button
          className={`capitalize text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none rounded text-md md:text-lg font-medium title ${
            isButtonDisabled
              ? "cursor-not-allowed"
              : "hover:bg-indigo-600 cursor-pointer"
          }`}
          onClick={engage}
          disabled={isButtonDisabled}
        >
          {engagementType}
        </button>
        {retweetMutation.isLoading ? (
          <div className="flex justify-center content-center mt-2">
            <p className="mr-2">Retweeting...</p> <Spinner />
          </div>
        ) : (
          <>
            {retweetMutation.isError ? (
              <Error text={"An error has occurred"} />
            ) : null}

            {retweetMutation.isSuccess ? (
              <Success text="Retweeted successfully!" />
            ) : null}
          </>
        )}
        {likeMutation.isLoading ? (
          <div className="flex justify-center content-center mt-2">
            <p className="mr-2">Liking...</p> <Spinner />
          </div>
        ) : (
          <>
            {likeMutation.isError ? (
              <Error text={"An error has occurred"} />
            ) : null}

            {likeMutation.isSuccess ? (
              <Success text="Liked successfully!" />
            ) : null}
          </>
        )}
        {replyTweetMutation.isLoading ? (
          <div className="flex justify-center content-center mt-2">
            <p className="mr-2">Replying...</p> <Spinner />
          </div>
        ) : (
          <>
            {replyTweetMutation.isError ? (
              <Error text={"An error has occurred"} />
            ) : null}

            {replyTweetMutation.isSuccess ? (
              <Success text="Replied successfully!" />
            ) : null}
          </>
        )}

        <p className="text-xs md:text-sm text-gray-400 text-opacity-90 mt-3">
          {selectedUsers.length > 0
            ? `You are about to ${engagementType} with ${selectedUsers.length} account(s)`
            : "Select at least one account to engage with."}
        </p>

        {isTweetIdNotCheckable || isTweetIdValid === false ? (
          <p className="text-xs md:text-sm text-gray-400 text-opacity-90 mt-3">
            Double check the tweet ID, it seems to be invalid.
          </p>
        ) : null}
      </div>
    </div>
  );
}
