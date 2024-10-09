"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

interface Message {
  message: string;
  image?: any;
  roomId: string;
}

export default function Page({ params }: { params: { userId: string } }) {
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(true);
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<any>(null);
  const [messageToBeSent, setMessageToBeSent] = useState("");
  const [image, setImage] = useState<any>();
  const encryptedUserId = params.userId;

  // Decrypted userId would go here (currently it's the same)
  const userId = encryptedUserId;

  useEffect(() => {
    // Initialize socket connection
    const socketConnection = io("https://chatapp-next-vi8m.onrender.com", {
      autoConnect: false,
    });
    socketConnection.connect();
    setSocket(socketConnection);

    // Listen for messages
    socketConnection.on("recieveMessage", (data: Message) => {
      console.log(data);
      setAllMessages((prevMessages) => {
        console.log([...prevMessages, data]);
        return [...prevMessages, data];
      });
    });

    // socketConnection.on("recieveImage", (data: Message) => {
    //   setAllMessages((prevMessages) => {
    //     console.log([...prevMessages, data]);
    //     return [...prevMessages, data];
    //   });
    // });

    // Join room on connection
    if (socketConnection && userId) {
      socketConnection.emit("joinRoom", { roomId: userId });
      console.log(`Joined room: ${userId}`);
    }

    return () => {
      socketConnection.disconnect();
    };
  }, [userId]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://chatapp-next-vi8m.onrender.com"
      );
      console.log("resp ", response.status);
    } catch (error) {
      console.log("object");
      // setErr(true);
      console.error("Error fetching data:", error);
    }
  };

  // const sendImage = (roomId: string) => {
  //   if (socket && image) {
  //     socket.emit("sendImage", {
  //       message: messageToBeSent,
  //       image: image,
  //       roomId: roomId,
  //     });
  //     setMessageToBeSent("");
  //     setImage(null);
  //   }
  // };

  const sendMessage = (roomId: string) => {
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
      // console.log(data.result);
    });
    data.readAsDataURL(e.target.files[0]);
  };

  // API calls
  useEffect(() => {
    setLoading(true);
    fetchData();
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[100vh] content-center animate-bounce">
        <div className="font-bold items-center content-center">
          Please wait while we start the server
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="flex items-center justify-center h-[100vh] content-center ">
        <div className="font-bold items-center content-center">
          Error running server
        </div>
      </div>
    );
  }

  // return (
  //   <div>
  //     <div>Dashboard</div>
  //   </div>
  // );

  return (
    <div>
      <div>My Room: {encryptedUserId}</div>
      <input
        id="text"
        placeholder="Enter your message"
        type="text"
        value={messageToBeSent}
        onChange={(e) => setMessageToBeSent(e.target.value)}
        className="text-black p-2 border rounded"
      />
      <div className="m-2"></div>

      <input
        placeholder="Enter room no"
        id="room"
        type="text"
        className="text-black p-2 border rounded"
      />
      <input
        placeholder="Enter room no"
        id="file"
        type="file"
        className="text-black p-2 border rounded"
        onChange={(e) => {
          imgToBlob(e);
        }}
      />

      {image ? (
        <img className="w-auto h-auto block max-h-20 " src={image} alt="" />
      ) : (
        <div>No image</div>
      )}

      <button
        onClick={() => {
          sendMessage(
            (document.getElementById("room") as HTMLInputElement).value
          );
        }}
        className="ml-2 bg-blue-500 text-white p-2 rounded"
      >
        Send
      </button>

      <div className="mt-4">
        <h3>Messages:</h3>
        <div className="flex-col-reverse overflow-y-scroll border-white border rounded-lg px-2 py-1 h-[75vh] md:h-[70vh] ">
          {allMessages.length > 0 ? (
            allMessages.map((msg, index) => (
              <div key={index} className="p-2 border-b ">
                {msg.image ? (
                  <div>
                    image
                    <img
                      className="w-auto h-auto block max-h-20 "
                      src={msg.image}
                      alt=""
                    />
                  </div>
                ) : (
                  <div>No image</div>
                )}
                <strong>Room {msg.roomId}:</strong> {msg.message}
              </div>
            ))
          ) : (
            <div>No messages yet</div>
          )}
        </div>
      </div>
    </div>
  );
}
