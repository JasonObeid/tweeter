import { useLogin } from "../api/useLogin";

export function Login() {
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
    <section className="text-gray-400 bg-gray-900 body-font">
      <div className="container px-5 py-24 mx-auto flex flex-wrap items-center">
        <div className="lg:w-2/6 md:w-1/2 bg-gray-800 bg-opacity-50 rounded-lg p-8 flex flex-col m-auto w-full mt-10 md:mt-0">
          <h2 className="text-white text-md md:text-lg font-medium title-font mb-5">
            Sign In
          </h2>
          <div className="relative mb-4">
            <label
              htmlFor="email"
              className="leading-7 text-sm md:text-base text-gray-400"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full bg-gray-600 bg-opacity-20 focus:bg-transparent focus:ring-2 focus:ring-indigo-900 rounded border border-gray-600 focus:border-indigo-500 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="relative mb-4">
            <label
              htmlFor="password"
              className="leading-7 text-sm md:text-base text-gray-400"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full bg-gray-600 bg-opacity-20 focus:bg-transparent focus:ring-2 focus:ring-indigo-900 rounded border border-gray-600 focus:border-indigo-500 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <button
            className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-md md:text-lg"
            onClick={() => loginMutation.mutate({ email, password })}
          >
            Sign in
          </button>
          <p className="text-xs md:text-sm md:text-base mt-3">
            Forgot your password?{" "}
            <button
              onClick={() => resetPasswordMutation.mutate(email)}
              className="hover:underline"
            >
              Reset password
            </button>
          </p>
          {errorText !== null ? (
            <p className="text-xs md:text-sm md:text-base mt-3 text-red-700">
              {errorText}
            </p>
          ) : null}
          {successText !== null ? (
            <p className="text-xs md:text-sm md:text-base mt-3 text-white">
              {successText}
            </p>
          ) : null}
          {/* <p className="text-xs md:text-sm md:text-base mt-3">
            Need an account?{" "}
            <Link to="/register" state={{ from: from }} replace 
              className="hover:underline">
              Sign up now
            </Link>
          </p> */}
        </div>
      </div>
    </section>
  );
}
