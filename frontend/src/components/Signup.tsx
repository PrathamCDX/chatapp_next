"use client";
import logInContext from "@/context/logInContext";
import { logInContextType } from "@/context/logInContext";
// import { logInContext, logInContextType } from "@/app/page";
import { encryptor } from "@/encryptDecrypt";
import axios, { Axios } from "axios";
import { redirect } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
// import LineWaveComponent from "./Loader";
import { Loader } from "./Loader";
interface userDataType {
  username: string | null;
  password: string | null;
}

const salt = Number(process.env.NEXT_PUBLIC_PASS_SALT);

const Signup = () => {
  const context = useContext(logInContext);
  // const context : logInContextType = useContext(logInContext);
  const { loggedIn, setLoggedIn } = context ? context : {};
  let inputCss =
    "m-2 bg-transparent border-b-2 text-white outline-none cursor-text";
  const [userData, setUserData] = useState<userDataType>({
    username: null,
    password: null,
  });
  const [rePassword, setRePassword] = useState("");
  const [authSignUpResponse, setAuthSignUpResponse] = useState<any>();
  const [loading, setLoading] = useState(false);

  const authSignUp = async ({ username, password }: userDataType) => {
    console.log(process.env.NEXT_PUBLIC_SOCKET_URI + "auth/signup");
    const response = await axios.post(
      process.env.NEXT_PUBLIC_SOCKET_URI + "auth/signup",
      { username, password }
    );

    setAuthSignUpResponse(response.data);
    if (response.data.success == true) {
      setLoggedIn && setLoggedIn(true);
      Cookies.set("auth-token", response.data.token);
      console.log("cookie set");
      redirect("/user/" + username);
    } else if (
      response.data.success == false &&
      response.data.statusCode == 200
    ) {
      setLoading(false);
      alert("Username already exists");
      // console.log("Username already exists", response.data);
    } else {
      setLoading(false);
      alert("error in signup");
      // console.log("error in signup", response.data);
    }
  };

  useEffect(() => {
    if (loggedIn === true) {
      redirect("/" + (userData.username as string));
    }
  }, [loggedIn]);

  return (
    <>
      <div className="border-4 rounded-xl p-6 w-60 flex flex-col  items-center justify-center">
        <h3>Sign up</h3>
        <div className="p-3 ">
          <input
            className={inputCss}
            type="text"
            placeholder="Enter Username"
            onChange={(e) => {
              const value = e.currentTarget.value;

              setUserData((prev) => {
                return { ...prev, username: value };
              });
            }}
          />
          <input
            className={inputCss}
            type="text"
            placeholder="Enter Password"
            onChange={(e) => {
              const value = e.currentTarget.value;

              setUserData((prev) => {
                return { ...prev, password: value };
              });
            }}
          />
          <input
            className={inputCss}
            type="text"
            placeholder="Re enter password"
            onChange={(e) => {
              setRePassword(e.currentTarget.value);
            }}
          />
        </div>
        <button
          className="border-2 py-1 px-3 rounded-md"
          onClick={() => {
            setLoading(true);
            if (rePassword != userData.password) {
              alert("Incorrect password");
            } else if (
              !userData.username ||
              !userData.password ||
              !rePassword
            ) {
              alert("Enter credentials");
            } else {
              authSignUp(userData);
              // authSignUp(userData).then((response) => {
              //   console.log(response);
              // });
              // redirect with encrypted username as params
            }
          }}
        >
          <div className="w-[100px] p-1">
            {loading ? (
              <div>
                <Loader />
              </div>
            ) : (
              <div>Sign up</div>
            )}
          </div>
        </button>
      </div>
    </>
  );
};

export default Signup;
