import { Session, User } from "@supabase/supabase-js";
import { useContext, createContext } from "react";
import { useLogin } from "../hooks/useLogin";

type AuthContextProviderProps = { children: React.ReactNode };
const AuthContext = createContext<{
  user: User | null;
  session: Session | null;
} | null>(null);

function AuthContextProvider({ children }: AuthContextProviderProps) {
  const { user, session } = useLogin();

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuthContext must be used within a AuthContextProvider");
  }
  return context;
}
export { AuthContextProvider, useAuthContext };
