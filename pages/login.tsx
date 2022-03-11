import React from "react";
import { LoadingSpinner } from "../src/components/LoadingSpinner";
import { useLogin } from "../src/hooks/useLogin";

export default function Login() {
  const {
    loginMutation,
    resetPasswordMutation,
    email,
    setEmail,
    password,
    setPassword,
    errorText,
    successText,
  } = useLogin();

  return (
    <section className="body-font bg-gray-900 text-gray-400">
      <div className="container mx-auto flex flex-wrap items-center px-5 py-24">
        <div className="m-auto mt-10 flex w-full flex-col rounded-lg bg-gray-800 bg-opacity-50 p-8 md:mt-0 md:w-1/2 lg:w-2/6">
          <h2 className="text-md title-font mb-5 flex content-center justify-center font-medium text-white md:text-lg">
            <div>Sign In</div>
            <LoadingSpinner />
          </h2>
          <div className="relative mb-4">
            <label
              htmlFor="email"
              className="text-sm leading-7 text-gray-400 md:text-base"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full rounded border border-gray-600 bg-gray-600 bg-opacity-20 py-1 px-3 text-base leading-8 text-gray-100 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:bg-transparent focus:ring-2 focus:ring-indigo-900"
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="relative mb-4">
            <label
              htmlFor="password"
              className="text-sm leading-7 text-gray-400 md:text-base"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full rounded border border-gray-600 bg-gray-600 bg-opacity-20 py-1 px-3 text-base leading-8 text-gray-100 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:bg-transparent focus:ring-2 focus:ring-indigo-900"
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <button
            className="text-md rounded border-0 bg-indigo-500 py-2 px-8 text-white hover:bg-indigo-600 focus:outline-none md:text-lg"
            disabled={loginMutation.isLoading}
            onClick={() => loginMutation.mutate({ email, password })}
          >
            Sign in
          </button>
          <p className="text-xs last:mt-3 md:text-sm">
            Forgot your password?{" "}
            <button
              onClick={() => resetPasswordMutation.mutate(email)}
              disabled={resetPasswordMutation.isLoading}
              className="hover:underline"
            >
              Reset password
            </button>
          </p>
          {errorText !== null ? (
            <p className="mt-3  text-xs text-red-700 md:text-sm">{errorText}</p>
          ) : null}
          {successText !== null ? (
            <p className="mt-3 text-xs  text-white md:text-sm">{successText}</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
