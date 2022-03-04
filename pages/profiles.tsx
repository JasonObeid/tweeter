import { useTwitterLogin } from "./hooks/useTwitterLogin";
import { useTwitterAccounts } from "./hooks/useTwitterAccounts";
import { Layout } from "./components/Layout";

export default function TwitterAccounts() {
  const { removeTwitterUserMutation } = useTwitterAccounts();
  const { startLoginFlowMutation } = useTwitterLogin();
  const { twitterAccountsQuery } = useTwitterAccounts();

  const users = twitterAccountsQuery.data || [];

  return (
    <Layout>
      <div className="container px-5 mx-auto text-center">
        <div className="bg-gray-900 shadow-md rounded-lg p-8 flex flex-col">
          <h2 className="text-white text-md md:text-lg mb-8 font-medium title-font">
            Twitter Accounts
          </h2>
          {users.map((user) => {
            return (
              <div
                key={user.id}
                className="flex sm:w-56 sm:m-auto mb-6 sm:mb-6 content-center"
              >
                <h2 className="text-white flex flex-1">{user.username}</h2>
                <button
                  className="text-white"
                  onClick={() => removeTwitterUserMutation.mutate(user.id)}
                >
                  x
                </button>
              </div>
            );
          })}
          <button
            type="button"
            onClick={() => startLoginFlowMutation.mutate()}
            className="flex mx-auto mt-8 text-white bg-indigo-500 hover:bg-indigo-600 border-0 py-2 px-8 focus:outline-none rounded text-md md:text-lg"
          >
            Add an account
          </button>
        </div>
      </div>
    </Layout>
  );
}
