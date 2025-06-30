"use client";
import userPageContext from "@/context/userPageContext";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { IoIosArrowBack } from "react-icons/io";
import { Loader } from "./Loader";

export default function Messagebox() {
  const context = useContext(userPageContext);

  const {
    displayMessageBox,
    setDisplayMessageBox,
    messageList,
    setMessageList,
    setCurrentChatFriend,
    currentChatFriend,
    userData,
    ...others
  } = context ? context : {};

  return (
    <div className="h-full border relative p-1 border-purple-900">
      <MessageHeading friendname={currentChatFriend} />
      {messageList ? (
        <MessageList username={userData} friendname={currentChatFriend} />
      ) : (
        <></>
      )}
      {/* <MessageList /> */}
      <SendBox username={userData} friendname={currentChatFriend} />
    </div>
  );
}

function MessageHeading({ friendname }: { friendname?: string }) {
  const context = useContext(userPageContext);
  const { displayMessageBox, setDisplayMessageBox, ...others } = context
    ? context
    : {};

  return (
    <div className=" border rounded-lg h-[52px] p-2 md:pl-10  flex items-center gap-x-2 sm:gap-x-10">
      <div
        className="md:hidden cursor-pointer"
        onClick={() => {
          setDisplayMessageBox &&
            setDisplayMessageBox((prev) => {
              return !prev;
            });
        }}
      >
        <IoIosArrowBack size={25} />
      </div>
      <div className="ml-4">
        <CgProfile size={25} />
      </div>
      <div className="text-xl">{friendname}</div>
    </div>
  );
}

function MessageList({
  username,
  friendname,
}: {
  username?: string;
  friendname?: string;
}) {
  const context = useContext(userPageContext);
  const {
    currentChatFriend,
    setMessageList,
    messageList,
    setMessageListLoader,
    messageListLoader,
  } = context ? context : {};
  const [getChatResponse, setGetChatResponse] = useState<any>(false);
  const scrollToBottom = () => {
    var divElement = document.getElementById("messagelist");

    if (divElement) {
      divElement.scroll(0, divElement.scrollHeight);
    }
  };
  useEffect(() => {
    scrollToBottom();

    // api fetch
    const getChat = async ({
      username,
      friendname,
    }: {
      username: string;
      friendname: string;
    }) => {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_SOCKET_URI + "data/getChat",
        { username, friendname }
      );
      // console.log("getChat response", response.data.data);
      setGetChatResponse(response.data.data);
      setMessageList && setMessageList(response.data.data);
      setMessageListLoader && setMessageListLoader(false);
    };

    if (username && friendname) {
      getChat({ username: username, friendname: friendname as string });
    }
  }, [currentChatFriend]);

  useEffect(() => {
    //
    // console.log("msg list changed", messageList);
  }, [messageList]);

  if (messageListLoader && currentChatFriend !== "Choose a friend") {
    return (
      <div className="items-center justify-center flex pt-4">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex flex-col-reverse overflow-y-scroll p-2 border border-yellow-300 rounded-lg h-[calc(100%-52px-60px-4px)] my-1 ">
      <div id="messagelist" className=" flex flex-col-reverse ">
        <div className=" flex flex-col-reverse"></div>
        {messageList ? (
          Object.entries(messageList).length > 0 ? (
            <div className="flex flex-col-reverse">
              {Object.entries(messageList)
                .reverse()
                .map(([key, element]: any) => {
                  let type = element[0];
                  let message = String(element).slice(1);
                  // console.log(element.slice(1, element.length));
                  return (
                    <div key={key}>
                      <Messages type={type} message={message} />
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="items-center justify-center flex">
              No chats till now
            </div>
          )
        ) : (
          <div>No chats till now</div>
        )}
      </div>
    </div>
  );
}

function SendBox({
  username,
  friendname,
}: {
  username: string;
  friendname: string;
}) {
  const [elements, setElements] = useState<any>();
  const [messageToBeSent, setMessageToBeSent] = useState("");
  const context = useContext(userPageContext);
  const { sendMessageViaSocket, setMessageList } = context ? context : {};
  const handleClick = async ({
    username,
    friendname,
  }: {
    username: string;
    friendname: string;
  }) => {
    if (messageToBeSent != "") {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_SOCKET_URI + "data/sendmsg",
        { username, friendname, message: messageToBeSent }
      );
      // console.log("sendMessage response", response.data.data);
    } else {
      alert("Please enter a message");
    }
  };

  return (
    <div
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          // console.log("Enter key pressed!");
          setMessageList &&
            setMessageList((prevMessages: string[]) => {
              return [...prevMessages, "0" + messageToBeSent];
            });
          sendMessageViaSocket &&
            sendMessageViaSocket(friendname, messageToBeSent);
          handleClick({ username, friendname });
          setMessageToBeSent("");
          elements.value = "";
        }
      }}
      className="absolute bottom-0 bg-[#ffffff1a] transpa h-[60px] border border-purple-700 px-2 w-full flex justify-between"
    >
      <div className="w-full h-[50px]">
        <textarea
          onChange={(e) => {
            setMessageToBeSent(e.currentTarget.value);
            setElements(e.currentTarget);
          }}
          rows={1}
          className="w-full outline-none bg-transparent p-2"
        />
      </div>
      <div className="flex items-center justify-center w-[200px]  px-3">
        {/* <input size={10} type="file" name="" id="" /> */}
        {/* <di className="flex items-center justify-center  h-[50px]">
          <label className="flex flex-col items-center justify-center w-[50px] my-1 h-full  border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 ">
            <div className="flex flex-col items-center justify-center px-2">
              <svg
                className="w-8 h-8 m-1 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
            </div>
            <input id="dropzone-file" type="file" className="hidden" />
          </label>
        </di> */}
        <button
          onClick={() => {
            setMessageList &&
              setMessageList((prevMessages: string[]) => {
                return [...prevMessages, "0" + messageToBeSent];
              });
            sendMessageViaSocket &&
              sendMessageViaSocket(friendname, messageToBeSent);
            handleClick({ username, friendname });
            setMessageToBeSent("");
            elements.value = "";
          }}
          className="bg-blue-400 rounded-lg ml-1 px-2 py-1 "
        >
          Send
        </button>
      </div>
    </div>
  );
}

function Messages({ type, message }: { type?: string; message?: string }) {
  if (type == "1") {
    return (
      <div className=" w-2/3  my-1">
        <div className="p-1 break-words border-red-600 border">{message}</div>
      </div>
    );
  } else {
    return (
      <div className=" relative flex justify-end my-1">
        <div className="p-1 w-2/3 border-blue-600 border break-words">
          {message}
        </div>
      </div>
    );
  }
}
