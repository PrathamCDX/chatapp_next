import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ACCESS_URL_1,
  },
}).listen(httpServer);

app.get("/", (req, res) => {
  res.send("hello world!");
});

io.on("connection", (socket) => {
  console.log("connection on : ", socket.id);
  socket.on("joinRoom", (args) => {
    const roomId = args.roomId;
    socket.join(roomId);
    console.log("joinded on : ", roomId);
  });

  socket.on("sendMessage", async (args) => {
    const { message, roomId } = args;
    socket.join(roomId);
    socket.broadcast
      .to(roomId)
      .emit("recieveMessage", { message: message, roomId: socket.id });

    socket.leave(roomId);
    console.log(socket.id, args, socket.rooms);
  });

  socket.on("message", (message) => {
    console.log(`message recieved: ${message}`);
  });
});

httpServer.listen(process.env.SERVER_PORT, () => {
  console.log("Running on port ", process.env.SERVER_PORT);
});
