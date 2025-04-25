"use client";

import axios from "axios";
import { redirect } from "next/navigation";
import { useState } from "react";
import Cookies from "js-cookie";

const Signin = () => {
  const [userInfo, setUserInfo] = useState({ username: "", password: "" });
  let inputCss =
    "m-2 bg-transparent border-b-2 text-white outline-none cursor-text";

  const handleSignIn = async () => {
    console.log("handleSignIn");
    const response = await axios.post(
      process.env.NEXT_PUBLIC_SOCKET_URI + "auth/signin",
      { username: userInfo.username, password: userInfo.password }
    );
    if (response.data.success === true) {
      console.log("response : ", response.data);
      Cookies.set("auth-token", response.data.token);
      console.log("cookie set");

      redirect("/user/" + userInfo.username);
    } else {
      alert("error in login");
    }
  };
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
          <input
            className="m-2 bg-transparent border-b-2 text-white outline-none cursor-text"
            type="text"
            placeholder="Enter Password"
            onChange={(e) => {
              const value = e.currentTarget.value;
              setUserInfo((prev) => {
                return { ...prev, password: value };
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
            handleSignIn();
          }}
        >
          click
        </button>
      </div>
    </>
  );
};

export default Signin;
