"use client";
import React, { useEffect, useRef, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { TbUserSearch } from "react-icons/tb";
import { useDetectClickOutside } from "react-detect-click-outside";
import axios from "axios";
import AddFriend from "./AddFriend";

function SearchDialog({
  setShowDialog,
}: {
  setShowDialog: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const ref = useDetectClickOutside({
    onTriggered: () => {
      // console.log("nooo object");
      setShowDialog(false);
    },
  });
  const [userToBeSearched, setUserToBeSearched] = useState("");
  const [searchedUser, setSearchedUser] = useState<any>();
  const handleClick = async (username: string) => {
    const response = await axios.post(
      process.env.NEXT_PUBLIC_SOCKET_URI + "data/getUser",
      { username: username }
    );
    if (response.data.success == false) {
      alert("User not found");
      return;
    } else {
      setSearchedUser(response.data.data);
    }
  };
  return (
    <div className="fixed border border-green-400 inset-0 flex items-center justify-center z-10">
      <div
        ref={ref}
        className="flex flex-col gap-8 items-center justify-evenly border absolute h-fit w-[60vw] rounded-xl backdrop-blur-xl p-7 shadow-lg"
      >
        <div
          onClick={() => {
            setShowDialog(false);
          }}
          className="fixed top-2 right-2 border-1 border-white"
        >
          <IoMdClose size={30} />
        </div>
        {searchedUser ? (
          <>
            <AddFriend username={searchedUser} setShowDialog={setShowDialog} />
          </>
        ) : (
          <div>
            <div className="text-center">
              <label className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">
                Search using User Id
              </label>
              <input
                type="text"
                id="user_id"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="User Id"
                required
              />
              <button className="mt-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                Submit
              </button>
            </div>

            <div className="text-center font-semibold text-gray-900 dark:text-white">
              OR
            </div>

            <div className="text-center">
              <label className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">
                Search using User Name
              </label>
              <input
                onChange={(e) => {
                  let value = e.currentTarget.value;
                  e.currentTarget.value &&
                    setUserToBeSearched(() => {
                      return value as string;
                    });
                }}
                type="text"
                id="user_name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="User Name"
                required
              />
              <button
                onClick={() => {
                  handleClick(userToBeSearched);
                }}
                className="mt-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Searchbar() {
  const [showDialog, setShowDialog] = useState(false);
  const [searchedUser, setSelectedUser] = useState<any>();

  const handleClickOutside = () => {};

  useEffect(() => {
    // console.log("object");
    // document.addEventListener("click", handleClickOutside);
  }, [showDialog]);

  return (
    <div>
      {showDialog ? (
        <div>
          <SearchDialog setShowDialog={setShowDialog} />
        </div>
      ) : (
        <div></div>
      )}
      <div>
        <div
          onClick={() => {
            setShowDialog((prev) => {
              return !prev;
            });
          }}
          className=" border p-2 cursor-pointer rounded-lg mt-1 flex gap-x-1 justify-center"
        >
          {/* <SearchDialog /> */}
          <div>
            <TbUserSearch size={30} />
          </div>
          <div className="text-xl opacity-70">Add friends</div>
        </div>
      </div>
    </div>
  );
}

export default Searchbar;
