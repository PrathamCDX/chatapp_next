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
import { authRouterV2 } from "./router/v2/authRouterV2.js";
import { dataRouterV2 } from "./router/v2/dataRouterV2.js";
import userModel_V2 from "./models/v2/user_v2.js";
import createIntervalService from "./helper/intervalService/intervalService.js";
import useProducer from "./helper/messageQueue/rabbitMQ.producer.js";
import useConsumer from "./helper/messageQueue/rabbitMQ.consumer.js";
import { clearRedisDB } from "./controllers/v2/auth.controllers.js";
import friendModel from "./models/friends.js";
import { migrateUsersToV2 } from "./helper/utils.js";

//

//
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

app.use("/api/v2/auth", authRouterV2);
app.use("/api/v2/data", dataRouterV2);

app.get("/", (req, res) => {
  try {
    res.status(222).send({ statusMessage: "No CORS _V2" });
  } catch (e) {
    res.status(500).send({ status: 500, error: "Internal Server Error _V2" });
  }
});

app.use("/auth", authRouterV2);
app.use("/data", dataRouterV2);

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

    const intervalService = createIntervalService(async () => {
      console.log("running timing server ");
      await useConsumer();
      // await clearRedisDB();
    });
    intervalService.start();
    // await migrateUsersToV2();
  } catch (err) {
    console.log("error connecting to db  ", err);
  }
  console.log("Running on port ", process.env.SERVER_PORT);
});
