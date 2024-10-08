"use client";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

interface Message {
  message: string;
  roomId: string;
}

export default function DemoPage() {
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [messagesToSend, setMessagesToSend] = useState("");
  const [roomId, setRoomId] = useState("");
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    const socketConnection = io("http://localhost:8000/", {
      autoConnect: false,
    });

    socketConnection.connect();

    socketConnection.on("recieveMessage", (data: Message) => {
      setAllMessages((prevMessages) => {
        console.log([...prevMessages, data]);
        return [...prevMessages, data];
      });
    });

    socketConnection.on("getId", (arg) => {
      console.log("Socket ID:", arg);
    });

    setSocket(socketConnection);

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  const sendToBackendSocket = (message: string, roomId: string) => {
    if (socket) {
      socket.emit("sendMessage", { message, roomId });
      console.log(`Sending text: ${message}, Room ID: ${roomId}`);
    }
  };

  return (
    <div className="m-2">
      <div>Hello World</div>
      <div className="m-3">
        <div>Text field</div>
        <input
          aria-label="Text"
          onChange={(e) => setMessagesToSend(e.target.value.trim())}
          className="text-black mb-3 rounded-md"
          type="text"
        />
        <br />
        <div>Room ID</div>
        <input
          onChange={(e) => setRoomId(e.target.value.trim())}
          className="text-black rounded-md"
          type="text"
        />
      </div>
      <button
        className="bg-red-300 p-3 rounded-md hover:bg-rose-500 duration-200"
        onClick={() => sendToBackendSocket(messagesToSend, roomId)}
      >
        Send to Socket from Frontend
      </button>
      <div className="mt-5">
        <h3>Messages</h3>
        {allMessages.length > 0 ? (
          allMessages.map((msg, index) => (
            <div key={index} className="p-2 border-b border-gray-300">
              <strong>Room {msg.roomId}:</strong> {msg.message}
            </div>
          ))
        ) : (
          <div>No messages yet</div>
        )}
      </div>
    </div>
  );
}
