import React, { Dispatch, SetStateAction } from "react";
import { EngagementType } from "../config/types";
import { useCheckTweetId } from "../hooks/useCheckTweetId";
import { useLikeTweet } from "../hooks/useLikeTweet";
import { useReplyTweetMutation } from "../hooks/useReplyTweet";
import { useRetweet } from "../hooks/useRetweet";
import { TwitterAuthUser } from "../hooks/useTwitterAccounts";
import { Error } from "./Error";
import {
  InvalidIcon,
  RetweetIcon,
  LikeIcon,
  ReplyIcon,
  ValidIcon,
} from "./Icons";
import { LoadingSpinner } from "./LoadingSpinner";
import { Success } from "./Success";

export function TweetInput({
  selectedUsers,
  engagementType,
  setEngagementType,
}: {
  selectedUsers: TwitterAuthUser[];
  engagementType: EngagementType;
  setEngagementType: Dispatch<SetStateAction<EngagementType>>;
}) {
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
      replyTweetMutation.mutate({ tweetId, selectedUsers });
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

  const isButtonDisabled = !(selectedUsers.length > 0 && isTweetIdValid);

  return (
    <div className="container mx-auto px-5 text-center">
      <div className="mb-8 flex flex-col rounded-lg bg-gray-900 p-8 shadow-md">
        <h2 className="text-md mb-1 font-medium text-white md:text-lg ">
          Tweet Engagement
        </h2>
        <p className="mb-5 leading-relaxed">
          Paste the Tweet ID of the tweet you want to engage with.
        </p>
        <p className="mb-5 leading-relaxed">
          For example, given a tweet URL like twitter.com/user/status/
          <strong>123456789</strong>, you would enter <strong>123456789</strong>
        </p>
        <div className="relative mb-4">
          <label
            htmlFor="tweet-url"
            className="mb-2 flex content-center justify-center gap-2 text-sm leading-7 text-gray-400 md:text-base"
          >
            Tweet ID {checkTweetIdQuery.isLoading ? <LoadingSpinner /> : null}
            {isTweetIdChecked ? (
              isTweetIdValid ? (
                <ValidIcon />
              ) : (
                <InvalidIcon />
              )
            ) : isTweetIdNotCheckable ? (
              <InvalidIcon />
            ) : null}
          </label>
          <input
            type="text"
            id="tweet-url"
            name="tweet-url"
            value={tweetId}
            onChange={(event) => {
              setTweetId(event.target.value);
            }}
            className={`w-full rounded border border-gray-700 bg-gray-800 py-1 px-3 text-base leading-8 text-gray-100 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900 ${
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
        <div className="mb-4 mt-2 flex flex-wrap sm:mx-auto sm:flex-nowrap md:mt-8">
          <button
            onClick={() => setEngagementType("retweet")}
            className={
              engagementType === "retweet"
                ? selectedButtonStyle
                : unselectedButtonStyle
            }
          >
            {<RetweetIcon />}
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
            {<LikeIcon />}
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
            {<ReplyIcon />}
            Reply
          </button>
        </div>
        <button
          className={`text-md title rounded border-0 bg-indigo-500 py-2 px-6 font-medium capitalize text-white focus:outline-none md:text-lg ${
            isButtonDisabled
              ? "cursor-not-allowed"
              : "cursor-pointer hover:bg-indigo-600"
          }`}
          onClick={engage}
          disabled={isButtonDisabled}
        >
          {engagementType}
        </button>
        {retweetMutation.isLoading ? (
          <div className="mt-2 flex content-center justify-center">
            <p className="mr-2">Retweeting...</p> <LoadingSpinner />
          </div>
        ) : (
          <>
            {retweetMutation.isError ? (
              <Error text={"An error has occurred"} />
            ) : null}

            {retweetMutation.isSuccess ? (
              <Success
                text={`Retweeted with ${
                  retweetMutation.data?.filter(
                    (isSuccess) => isSuccess === true,
                  ).length
                } / ${retweetMutation.data?.length} accounts`}
              />
            ) : null}
          </>
        )}
        {likeMutation.isLoading ? (
          <div className="mt-2 flex content-center justify-center">
            <p className="mr-2">Liking...</p> <LoadingSpinner />
          </div>
        ) : (
          <>
            {likeMutation.isError ? (
              <Error text={"An error has occurred"} />
            ) : null}

            {likeMutation.isSuccess ? (
              <Success
                text={`Liked with ${
                  likeMutation.data?.filter((isSuccess) => isSuccess === true)
                    .length
                } / ${likeMutation.data?.length} accounts`}
              />
            ) : null}
          </>
        )}
        {replyTweetMutation.isLoading ? (
          <div className="mt-2 flex content-center justify-center">
            <p className="mr-2">Replying...</p> <LoadingSpinner />
          </div>
        ) : (
          <>
            {replyTweetMutation.isError ? (
              <Error text={"An error has occurred"} />
            ) : null}

            {replyTweetMutation.isSuccess ? (
              <Success
                text={`Replied with ${
                  replyTweetMutation.data?.filter(
                    (isSuccess) => isSuccess === true,
                  ).length
                } / ${replyTweetMutation.data?.length} accounts`}
              />
            ) : null}
          </>
        )}

        <p className="mt-3 text-xs text-gray-400 text-opacity-90 md:text-sm">
          {selectedUsers.length > 0
            ? `You are about to ${engagementType} with ${selectedUsers.length} account(s)`
            : "Select at least one account to engage with."}
        </p>

        {isTweetIdNotCheckable || isTweetIdValid === false ? (
          <p className="mt-3 text-xs text-gray-400 text-opacity-90 md:text-sm">
            Double check the tweet ID, it seems to be invalid.
          </p>
        ) : null}
      </div>
    </div>
  );
}
