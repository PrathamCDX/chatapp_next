"use client";
import FriendList from "@/components/FriendList";
import Messagebox from "@/components/Messagebox";
import { decryptor } from "@/encryptDecrypt";
import axios from "axios";
import { createContext, use, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import userPageContext from "@/context/userPageContext";

interface Message {
  message: string;
  image?: any;
  roomId: string;
}

// Define the type for the context value
interface userPageContextType {
  displayMessageBox: boolean;
  setDisplayMessageBox: React.Dispatch<React.SetStateAction<boolean>>;
  userData?: any;
  messageList?: any;
  setMessageList: React.Dispatch<React.SetStateAction<any>>;
  currentChatFriend?: any;
  setCurrentChatFriend?: React.Dispatch<React.SetStateAction<any>>;
  sendMessageViaSocket?: (roomId: string, messageToBeSent: string) => void;
  forceRender?: { render: boolean };
  setForceRender?: React.Dispatch<React.SetStateAction<{ render: boolean }>>;
}
// Create context with an initial value of `undefined` or a default object
// export const userPageContext = createContext<
//   userPageContextType | undefined | never
// >(undefined);

export default function Page({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [messageList, setMessageList] = useState<string[]>([]);
  const [forceRender, setForceRender] = useState({ render: true });
  const [windowWidth, setwindowWidth] = useState(window.innerWidth);
  const [displayMessageBox, setDisplayMessageBox] = useState(false); //use content
  const [currentChatFriend, setCurrentChatFriend] = useState("Choose a friend"); // use context
  const [loading, setLoading] = useState(true);
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<any>(null);
  const [messageToBeSent, setMessageToBeSent] = useState(""); // use context
  const [image, setImage] = useState<any>();
  const resolvedParams = use(params);
  // Decrypted userId would go here (currently it's the same)
  const { userId } = resolvedParams;
  // decrypt userId
  const userData = userId;

  useEffect(() => {
    console.log("userId is: ", userId);
    // Initialize socket connection
    const socketConnection = io(process.env.NEXT_PUBLIC_SOCKET_URI, {
      autoConnect: false,
    });
    socketConnection.connect();
    setSocket(socketConnection);

    // Listen for messages
    socketConnection.on("recieveMessage", (data: Message) => {
      setMessageList((prevMessages) => {
        console.log("recieved via scoket ", data.message);
        // console.log([...prevMessages, data.message]);
        return [...prevMessages, "1" + data.message];
      });
    });

    // Join room on connection
    if (socketConnection && userId) {
      socketConnection.emit("joinRoom", { roomId: userId });
      console.log(`Joined room: ${userId}`);
    }

    return () => {
      socketConnection.disconnect();
    };
  }, [userId]);

  const handleLogIn = async (username: string, password: string) => {
    console.log(username, password);
    const response = await axios.post(
      process.env.NEXT_PUBLIC_SOCKET_URI + "auth/signin",
      { username: username, password: password }
    );

    if (response.data.success == true) {
      setIsAuth(true);
    } else {
      alert("error in login");
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/");
      // console.log("resp ", response.data);
    } catch (error) {
      // console.log("object");
      // setErr(true);
      console.error("Error fetching data: ", error);
    }
  };

  const sendMessageViaSocket = (roomId: string, messageToBeSent: string) => {
    if (socket && (messageToBeSent || image)) {
      socket.emit("sendMessage", {
        message: messageToBeSent,
        image: image,
        roomId: roomId,
      });
      console.log(
        `Sending text: ${messageToBeSent}, image: ${
          image ? "true" : "false"
        } Room ID: ${roomId}`
      );
      setMessageToBeSent("");
      setImage(null);
    }
  };

  const imgToBlob = (e: any) => {
    const data = new FileReader();
    data.addEventListener("load", () => {
      setImage(data.result);
      console.log(e.target.files.item(0).size / 1024);
    });
    data.readAsDataURL(e.target.files[0]);
  };

  const sendImagesInChunks = (roomId: string) => {
    if (image) {
      socket.emit("sendTotalChunks", { totalChunks: image, roomId: roomId });
      socket.emit("imageComplete", { roomId: roomId });
    }
  };

  // API calls
  useEffect(() => {
    // handle window resise
    const handleResize = () => {
      setwindowWidth(window.innerWidth);
    };

    // Add event listener to track window resize
    window.addEventListener("resize", handleResize);

    setLoading(true);
    fetchData();
    setLoading(false);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {}, []);
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[100vh] content-center animate-bounce">
        <div className="font-bold items-center content-center">
          Please wait while we start the server
        </div>
      </div>
    );
  }

  if (!isAuth) {
    return (
      <>
        <div className="flex flex-col items-center justify-center h-[100vh] content-center ">
          <h1 className="mb-5 text-3xl font-semibold">Hey {userData}</h1>
          <input
            className="m-2 bg-transparent border-b-2 text-white outline-none cursor-text"
            type="text"
            placeholder="Enter Password"
            onChange={(e) => {
              const value = e.currentTarget.value;
              setPassword((prev) => {
                return value as string;
              });
            }}
          />

          <button
            onClick={() => {
              handleLogIn(userId, password);
            }}
            className="border-2 py-1 px-3 rounded-md"
          >
            L0g 1n
          </button>
        </div>
      </>
    );
  }

  return (
    <userPageContext.Provider
      value={{
        setDisplayMessageBox,
        displayMessageBox,
        userData,
        messageList,
        setMessageList,
        currentChatFriend,
        setCurrentChatFriend,
        sendMessageViaSocket,
        forceRender,
        setForceRender,
      }}
    >
      <div className="pt-6 flex items-center justify-center">
        <div className="border-white border rounded-lg w-[75vw] h-[75vh] ">
          {(!displayMessageBox || windowWidth >= 900) && (
            <div className="float-left w-full md:w-[35%] border-red-400 border h-full ">
              <FriendList />
            </div>
          )}
          {(displayMessageBox || windowWidth >= 900) && (
            <div className="float-right w-full md:w-[65%] h-full border-blue-400 border">
              <Messagebox />
            </div>
          )}
        </div>
      </div>
    </userPageContext.Provider>
  );
}
