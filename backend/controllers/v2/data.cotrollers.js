import Redis from "ioredis";

import userModel_V2 from "../../models/v2/user_v2.js";
import useProducer from "../../helper/messageQueue/rabbitMQ.producer.js";
import { Error } from "mongoose";

import dotenv from "dotenv";
import { setRedis } from "../../helper/utils.js";
import { reduceVertices } from "three/examples/jsm/utils/SceneUtils.js";
dotenv.config();

const redisUrl = String(process.env.REDIS_URL);
const redisClient = new Redis(redisUrl);

const demoFunData = async (req, res) => {
  const { username } = req.body;
  const userData = await userModel_V2.findOne({ username });

  return res.send({ userData });
};

// POST updateSeen

// POST addFriends
const addFriends = async (req, res) => {
  console.log("/addFriends");
  try {
    const { username, friendname } = req.body;

    if (!username || !friendname) {
      throw "username and friendname can not be same";
    }

    if (username === friendname) {
      throw "Friend name can not be same as username";
    }

    let redisUser = await redisClient.get(username);
    let redisFriend = await redisClient.get(friendname);
    // check in redis
    // check in mongo
    // update redis
    // add to redis
    // push to queue

    if (!redisUser) {
      // check in mongo db
      let user = await userModel_V2.findOne({ username: username });
      if (!user) throw new Error("user not found");
      if (!user?.friendList[friendname]) {
        // new friend
        user.friendList[friendname] = [];

        // update redis
        await redisClient.set(username, JSON.stringify(user));
        await redisClient.expire(username, 1 * 60 * 60);

        // send to producer
      } else {
        // friend already added
        return res.send({
          success: true,
          statusCode: 200,
          errMessage: "Already added",
        });
      }
    } else {
      let redisUserJson = await JSON.parse(redisUser);
      redisUserJson.friendList[friendname] = [];
      await redisClient.set(username, JSON.stringify(redisUserJson));
      await redisClient.expire(username, 1 * 60 * 60);
    }

    if (!redisFriend) {
      let friend = await userModel_V2.findOne({ username: friendname });
      if (!friend) throw new Error("friend user not found");
      if (!friend?.friendList[username]) {
        // undefined : new friend
        friend.friendList[username] = [];

        // update redis
        await setRedis(friendname, friend);
      }
    } else {
      let redisFriendJson =
        typeof redisFriend === "string" ? JSON.parse(redisFriend) : redisFriend;
      redisFriendJson.friendList[username] = [];
      await redisClient.set(friendname, JSON.stringify(redisFriendJson));
      await redisClient.expire(friendname, 1 * 60 * 60);
    }

    // res.send(redisUser.friendList);

    // revalidate the data
    redisUser = await redisClient.get(username);
    redisFriend = await redisClient.get(friendname);

    // validate
    if (!redisUser) {
      throw new Error("redisUser is empty or undefined");
    }
    if (!redisFriend) {
      throw new Error("redisFriend is empty or undefined");
    }

    // create new operations
    let newOperationUser = {
      replaceOne: {
        filter: { username: username },
        replacement: await JSON.parse(redisUser),
      },
    };

    let newOperationFriend = {
      replaceOne: {
        filter: { username: friendname },
        replacement: await JSON.parse(redisFriend),
      },
    };

    // console.log("op :   ", redisFriend);

    // add to queue
    useProducer(JSON.stringify(newOperationUser));
    useProducer(JSON.stringify(newOperationFriend));

    // send response

    return res.send({
      success: true,
      statusCode: 200,
      errMessage: "Successfully added",
    });
  } catch (error) {
    console.error(error);
    res.send({
      success: false,
      statusCode: 500,
      errEndpoint: "error /data/addFriends",
      errMessage: error,
    });
  }
};

// .post("/sendmsg",

const sendmsg = async (req, res) => {
  console.log("/sendmsg");
  try {
    const { username, friendname, message } = req.body;

    // check redis
    // check mongo
    // update redis
    // use procducer

    let redisUser = await redisClient.get(username);
    let redisFriend = await redisClient.get(friendname);
    let newOperationUser, newOperationFriend;

    if (!redisUser) {
      // check in mongo

      let mongoUser = await userModel_V2.findOne({ username: username });
      redisUser = await JSON.stringify(mongoUser);
    }

    // handle User from redis
    let redisUserJSON = await JSON.parse(redisUser);

    if (redisUserJSON.friendList[friendname]) {
      // push back to the array

      redisUserJSON.friendList[friendname].push("0" + message);
    } else {
      // set new array

      redisUser.friendList[friendname] = ["0" + message];
    }

    // set operation for user
    newOperationUser = {
      replaceOne: {
        filter: { username: username },
        replacement: redisUserJSON,
      },
    };

    // update user in redis
    await setRedis(username, JSON.stringify(redisUserJSON));

    if (!redisFriend) {
      // check in mongo
      let friendMongo = await userModel_V2.findOne({ username: friendname });
      redisFriend = await JSON.stringify(friendMongo);
    }

    let redisFriendJSON = await JSON.parse(redisFriend);
    if (redisFriendJSON.friendList[username]) {
      // push back to array
      redisFriendJSON.friendList[username].push("1" + message);
    } else {
      // set new array
      redisFriendJSON.friendList[username] = ["1" + message];
    }

    // set new operation for friend
    newOperationFriend = {
      replaceOne: {
        filter: { username: friendname },
        replacement: redisFriendJSON,
      },
    };

    // update redis
    await setRedis(friendname, JSON.stringify(redisFriendJSON));

    // update queue
    useProducer(JSON.stringify(newOperationUser));
    useProducer(JSON.stringify(newOperationFriend));

    return res.send({
      success: true,
      statusCode: 200,
      errMessage: "msg sent",
    });
  } catch (error) {
    console.error(error);
    res.send({
      success: false,
      statusCode: 500,
      errEndpoint: "error /data/sendmsg",
      errMessage: error,
    });
  }
};

// post("/friendList"
const friendList = async (req, res) => {
  console.log("/friendList");
  try {
    const { username } = req.body;

    // Validate input
    if (!username) {
      return res.status(400).json({
        success: false,
        message: "Username is required",
      });
    }

    // Check redis
    let redisUser = await redisClient.get(username);
    let user;

    if (!redisUser) {
      // Check mongo - added await and proper query execution
      user = await userModel_V2.findOne({ username }).lean();

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Cache in redis
      await redisClient.set(username, JSON.stringify(user));
    } else {
      user = await JSON.parse(redisUser);
    }

    // Extract friendList keys safely
    let friendList = [];
    if (user.friendList && typeof user.friendList === "object") {
      friendList = Object.keys(user.friendList);
    }

    return res.send({
      success: true,
      statusCode: 200,
      data: friendList,
      errMessage: "fetched succesfully",
    });
  } catch (error) {
    console.error("Error in friendList:", error);
    return res.send({
      success: false,
      statusCode: 500,
      path: "/data/friendList",
      errMessage: error,
    });
  }
};

// post("/getChat"
const getChat = async (req, res) => {
  console.log("/getChat");

  try {
    const { username, friendname } = req.body;

    let redisUser = await redisClient.get(username);

    if (!redisUser) {
      let mongoUser = await userModel_V2.findOne({ username: username }).lean();
      redisUser = await JSON.stringify(mongoUser);
    }

    let redisUserJSON = await JSON.parse(redisUser);

    let chats_ = redisUserJSON.friendList[friendname];
    return res.send({
      success: true,
      statusCode: 200,
      data: chats_ ? chats_ : [],
      errMessage: "fetched new succesfully",
    });
  } catch (error) {
    return res.send({
      success: false,
      statusCode: 500,
      path: "/data/getChat",
      errMessage: error,
    });
  }
};

// post("/getUser",
const getUser = async (req, res) => {
  console.log("/getUser");
  try {
    const { username } = req.body;

    let redisUser = await redisClient.get(username);
    if (!redisUser) {
      let mongoUser = await userModel_V2.findOne({ username }).lean();
      if (mongoUser) {
        redisUser = await JSON.stringify(mongoUser);
      }
    }
    if (!redisUser) {
      return res.send({
        success: false,
        statusCode: 200,
        data: undefined,
        errMessage: "no user found ",
      });
    } else {
      return res.send({
        success: true,
        statusCode: 200,
        data: username,
        errMessage: "user found",
      });
    }
  } catch (error) {
    console.error(error);
    return res.send({
      success: false,
      statusCode: 500,
      path: "/data/getUser",
      errMessage: error,
    });
  }
};

export { demoFunData, addFriends, sendmsg, friendList, getChat, getUser };
