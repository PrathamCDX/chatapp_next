import express from "express";
import mongoose from "mongoose";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./router/authRouter.js";
import userModel from "./models/user.js";
import dataRouter from "./router/dataRouter.js";
import bcrypt from "bcrypt";
import msgModel from "./models/msg.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
}).listen(httpServer);

// API CALLS

app.get("/", (req, res) => {
  try {
    res.status(222).send({ statusMessage: "No CORS" });
  } catch (e) {
    res.status(500).send({ status: 500, error: "Internal Server Error" });
  }
});

app.use("/auth", authRouter);
app.use("/data", dataRouter);

// SOCKET HANDLES

io.on("connection", (socket) => {
  console.log("connection on : ", socket.id);

  socket.on("joinRoom", (args) => {
    const roomId = args.roomId;
    socket.join(roomId);
    console.log("joinded on : ", roomId);
  });

  socket.on("sendMessage", async (args) => {
    const { message, image, roomId } = args;
    socket.join(roomId);
    socket.broadcast.to(roomId).emit("recieveMessage", {
      message: message,
      image: image,
      roomId: socket.id,
    });

    socket.leave(roomId);
    console.log(socket.id, message, roomId, socket.rooms);
  });

  socket.on("message", (message) => {
    console.log(`message recieved: ${message}`);
  });
});

httpServer.listen(process.env.SERVER_PORT, async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("Mongo Db connected");
    // const demo = await userModel.find({ username: "user1" });
    // console.log(demo);
    // bcrypt.hash("password", 6).then(async (hash) => {
    //   //     const test = new TestModel({ name: 'Test Testerson' });
    //   // const savedTest = await test.save();
    //   const demo = await new userModel({
    //     username: "username",
    //     password: hash,
    //   });
    //   await demo.save();
    // });

    // const demo1 = new msgModel({
    //   userName: "a",
    //   friendName: "b",
    //   chat: ["0hello"],
    //   seenStatus: false,
    // });
    // await demo1.save();
  } catch (err) {
    console.log("error connecting to db  ", err);
  }
  console.log("Running on port ", process.env.SERVER_PORT);
});
