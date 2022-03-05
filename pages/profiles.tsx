import { Layout } from "../src/components/Layout";
import EnforceAuthenticated from "../src/components/EnforceAuthenticated";
import { useTwitterAccounts } from "../src/hooks/useTwitterAccounts";
import { useTwitterLogin } from "../src/hooks/useTwitterLogin";

export const getServerSideProps = EnforceAuthenticated();

export default function TwitterAccounts() {
  const { removeTwitterUserMutation } = useTwitterAccounts();
  const { startLoginFlowMutation } = useTwitterLogin();
  const { twitterAccountsQuery } = useTwitterAccounts();

  const users = twitterAccountsQuery.data ?? [];

  return (
    <Layout>
      <div className="container mx-auto px-5 text-center">
        <div className="flex flex-col rounded-lg bg-gray-900 p-8 shadow-md">
          <h2 className="text-md title-font mb-8 font-medium text-white md:text-lg">
            Twitter Accounts
          </h2>
          {users.map((user) => {
            return (
              <div
                key={user.id}
                className="mb-6 flex content-center sm:m-auto sm:mb-6 sm:w-56"
              >
                <h2 className="flex flex-1 text-white">{user.username}</h2>
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
            className="text-md mx-auto mt-8 flex rounded border-0 bg-indigo-500 py-2 px-8 text-white hover:bg-indigo-600 focus:outline-none md:text-lg"
          >
            Add an account
          </button>
        </div>
      </div>
    </Layout>
  );
}
