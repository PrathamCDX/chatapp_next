"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

interface Message {
  message: string;
  roomId: string;
}

export default function Page({ params }: { params: { userId: string } }) {
  const [loading, setLoading] = useState(true);
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<any>(null);
  const [messageToBeSent, setMessageToBeSent] = useState("");
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
      setAllMessages((prevMessages) => {
        console.log([...prevMessages, data]);
        return [...prevMessages, data];
      });
    });

    // Join room on connection
    if (socketConnection && userId) {
      socketConnection.emit("joinRoom", { roomId: userId });
      console.log(`Joined room: ${userId}`);
    }

    // Cleanup on component unmount
    return () => {
      socketConnection.disconnect();
    };
  }, [userId]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://chatapp-next-vi8m.onrender.com/"
      );
      console.log(response.data); // Handle the response data
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    setLoading(true);
    fetchData();
    setLoading(false);
  }, []);

  const sendMessage = (roomId: string) => {
    if (socket && messageToBeSent) {
      socket.emit("sendMessage", { message: messageToBeSent, roomId: roomId });
      console.log(`Sending text: ${messageToBeSent}, Room ID: ${userId}`);
      setMessageToBeSent(""); // Clear the message input after sending
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[100vh] content-center ">
        <div className="font-bold items-center content-center">
          Please wait while we start the server
        </div>
      </div>
    );
  }

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
        <div className="overflow-y-scroll">
          {allMessages.length > 0 ? (
            allMessages.map((msg, index) => (
              <div key={index} className="p-2 border-b">
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
