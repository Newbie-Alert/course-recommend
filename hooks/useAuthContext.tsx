import { Session } from "@supabase/supabase-js";
import { createContext, useContext } from "react";

export type AuthData = {
  session?: Session | null;
  profile?: any | null;
  isLoading: boolean;
  isLoggedIn: boolean;
};

export const AuthContext = createContext<AuthData>({
  session: undefined,
  profile: undefined,
  isLoading: true,
  isLoggedIn: false,
});

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) throw new Error("provider 안에서만 사용 가능합니다.");

  return context;
};
