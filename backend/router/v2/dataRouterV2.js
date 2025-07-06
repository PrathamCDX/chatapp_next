import express from "express";
import {
  addFriends,
  demoFunData,
  friendList,
  getChat,
  getUser,
  sendmsg,
} from "../../controllers/v2/data.cotrollers.js";

const dataRouterV2 = express.Router();

dataRouterV2.post("/", demoFunData);

// // POST updateSeen
// dataRouterV2.post("/updateSeen", updateSeen);

// // POST addFriends
dataRouterV2.post("/addFriends", addFriends);

// // .post("/sendmsg",

dataRouterV2.post("/sendmsg", sendmsg);

// // post("/friendList"
dataRouterV2.post("/friendList", friendList);

// // post("/getChat"
dataRouterV2.post("/getChat", getChat);

// // post("/getUser",
dataRouterV2.post("/getUser", getUser);

export { dataRouterV2 };
