"use client";

import { redirect } from "next/navigation";
import { useState } from "react";

const Signin = () => {
  const [userInfo, setUserInfo] = useState({ username: "", password: "" });
  let inputCss =
    "m-2 bg-transparent border-b-2 text-white outline-none cursor-text";

  return (
    <>
      <div className="border-4 rounded-xl p-6 w-60 flex flex-col  items-center justify-center">
        <h3>Sign in</h3>
        <div className="p-3 ">
          <input
            className={inputCss}
            type="text"
            placeholder="Enter Username"
            onChange={(e) => {
              const value = e.currentTarget.value;

              setUserInfo((prev) => {
                return { ...prev, username: value };
              });
            }}
          />
          {/* <input
            className={inputCss}
            type="text"
            placeholder="Enter Password"
            onChange={(e) => {
              const value = e.currentTarget.value;

              setUserInfo((prev) => {
                return { ...prev, password: value };
              });
            }}
          /> */}
        </div>
        <button
          className="border-2 py-1 px-3 rounded-md"
          onClick={() => {
            redirect("/" + userInfo.username);
          }}
        >
          click
        </button>
      </div>
    </>
  );
};

export default Signin;
