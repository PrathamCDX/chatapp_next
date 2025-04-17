import { createContext } from "react";

interface logInContextType {
  loggedIn: boolean;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const logInContext = createContext<logInContextType | undefined>(undefined);

export default logInContext;
export type { logInContextType };
