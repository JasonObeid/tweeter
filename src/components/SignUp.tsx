import { useState } from "react";
import { useMutation } from "react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { client } from "../api/supabaseClient";

export function SignUp() {
  const [email, setEmail] = useState<null | string>(null);
  const [password, setPassword] = useState<null | string>(null);

  const navigate = useNavigate();
  const location = useLocation() as {
    state?: {
      from?: { pathname: string };
    };
  };

  const from = location.state?.from?.pathname || "/";
  const signUpMutation = useMutation("signUp", signUp, {
    onSuccess: () => navigate(from, { replace: true }),
  });

  async function signUp() {
    if (
      email !== null &&
      email.length > 0 &&
      password !== null &&
      password.length > 0
    ) {
      const { error } = await client.auth.signUp({
        email: email,
        password: password,
      });
      if (error) {
        throw new Error(error.message);
      }
    }
    throw new Error("Please enter a username or password");
  }

  return (
    <section className="text-gray-400 bg-gray-900 body-font">
      <div className="container px-5 py-24 mx-auto flex flex-wrap items-center">
        <div className="lg:w-3/5 md:w-1/2 md:pr-16 lg:pr-0 pr-0">
          <h1 className="title-font font-medium text-3xl text-white">
            Slow-carb next level shoindxgoitch ethical authentic, poko scenester
          </h1>
          <p className="leading-relaxed mt-4">
            Poke slow-carb mixtape knausgaard, typewriter street art gentrify
            hammock starladder roathse. Craies vegan tousled etsy austin.
          </p>
        </div>
        <div className="lg:w-2/6 md:w-1/2 bg-gray-800 bg-opacity-50 rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0">
          <h2 className="text-white text-md md:text-lg font-medium title-font mb-5">
            Sign Up
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
            onClick={() => signUpMutation.mutate()}
          >
            Sign up
          </button>
          <p className="text-xs md:text-sm md:text-base mt-3">
            Already have an account?{" "}
            <Link
              to="/login"
              state={{ from: from }}
              replace
              className="hover:underline"
            >
              Sign in now
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
