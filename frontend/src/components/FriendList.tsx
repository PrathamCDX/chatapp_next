import React, { useContext, useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import Searchbar from "./Searchbar";
import userPageContext from "@/context/userPageContext";
// import { userPageContext } from "@/app/[userId]/page";
import axios from "axios";
import { axiosResponseInterface } from "@/interfaces/typeinterfaces";
import Loader from "./Loader";

export default function FriendList() {
  const context = useContext(userPageContext);
  const {
    displayMessageBox,
    setDisplayMessageBox,
    userData,
    currentChatFriend,
    setCurrentChatFriend,
    forceRender,
    setMessageListLoader,

    ...others
  } = context ? context : {};
  const [getFriendListResponse, setgetFriendListResponse] = useState<any>();

  useEffect(() => {
    const getFriendList = async (username: string) => {
      const response: axiosResponseInterface = await axios.post(
        process.env.NEXT_PUBLIC_SOCKET_URI + "data/friendList",
        { username: username }
      );
      console.log(response);
      if (response.data.success == true) {
        // console.log("success true");
        setgetFriendListResponse(response.data.data);
        // console.log(response.data.data);
        // console.log(typeof response.data.data);
      }
    };

    getFriendList(userData);
    // console.log(process.env.NEXT_PUBLIC_SOCKET_URI);
    // console.log("friend list ");
    // axios.get(process.env.NEXT_PUBLIC_SOCKET_URI + "data/friendList");
  }, [forceRender]);

  useEffect(() => {
    // console.log("currentChatFriend changed:", currentChatFriend);
  }, [currentChatFriend]);
  return (
    <div className={"overflow-y-scroll friendlistscrollbar px-1 h-full "}>
      <Searchbar />
      <div className="">
        {getFriendListResponse ? (
          <div>
            {Object.entries(getFriendListResponse).map((element: any) => {
              let name = element[1].friendName;
              let newMessages = element[1].seenStatus;
              return (
                <div
                  className="cursor-pointer"
                  key={name}
                  onClick={() => {
                    setMessageListLoader && setMessageListLoader(true);
                    setCurrentChatFriend && setCurrentChatFriend(name);
                  }}
                >
                  <Friendname params={{ name, newMessages }} />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="items-center justify-center flex pt-4">
            <Loader />
          </div>
        )}
      </div>
    </div>
  );
}

const Friendname = ({
  params,
}: {
  params: { name: string; pfpUrl?: string; newMessages?: boolean };
}) => {
  const context = useContext(userPageContext);
  const { displayMessageBox, setDisplayMessageBox, ...others } = context
    ? context
    : {};
  return (
    <div
      onClick={() => {
        setDisplayMessageBox &&
          setDisplayMessageBox((prev) => {
            return !prev;
          });
      }}
    >
      <div className=" flex items-center  h-[40px]  border rounded-xl my-1 relative">
        {/* <span className="mx-8">
        </span>
        <span className="ml-4">Name</span> */}
        <div className="ml-5 mr-3">
          {params.pfpUrl === undefined ? (
            <CgProfile size={25} />
          ) : (
            <div> {params.pfpUrl}</div>
          )}
        </div>
        <div>{params.name}</div>
        {params.newMessages ? (
          <div></div>
        ) : (
          <div className="bg-red-400 rounded-full px-2 text-xs text- right-[10%] absolute ">
            New
          </div>
        )}
      </div>
    </div>
  );
};

// export default FriendList;
