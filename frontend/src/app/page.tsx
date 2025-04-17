"use client";

import Signin from "@/components/Signin";
import DemoPage from "./demoPage";
import Signup from "@/components/Signup";
import { createContext, useEffect, useState } from "react";
import { redirect } from "next/navigation";

interface logInContextType {
  loggedIn: boolean;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const logInContext = createContext<logInContextType | undefined>(undefined);
export default function Home() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <logInContext.Provider value={{ loggedIn, setLoggedIn }}>
      <div className="flex flex-col  items-center justify-center w-[100vw] h-[100vh]">
        <div className="font-bold text-5xl">
          {isSignUp ? <Signup /> : <Signin />}
        </div>
        <button
          onClick={() => {
            setIsSignUp((prev) => {
              return !prev;
            });
          }}
          className="border-2 mt-4 py-1 px-3 rounded-md"
        >
          {isSignUp ? <> want to Sign In ?</> : <>Want to Sign Up ?</>}
        </button>
      </div>
    </logInContext.Provider>
  );
  //  <div>{/* <DemoPage /> */}</div>;
}

export { logInContext };
export type { logInContextType };
