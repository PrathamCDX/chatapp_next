import Redis from "ioredis";
import jwt from "jsonwebtoken";

import bcrypt from "bcrypt";
import { encryptor } from "../../router/authRouter.js";
import userModel_V2 from "../../models/v2/user_v2.js";
import useProducer from "../../helper/messageQueue/rabbitMQ.producer.js";
import { configDotenv } from "dotenv";

import dotenv from "dotenv";
dotenv.config();

const ttl = 1 * 60 * 60;
const redisUrl = String(process.env.REDIS_URL);
const redisClient = new Redis(redisUrl);
// const redisClient = new Redis(
//   "rediss://default:AVNjAAIjcDE1ZGZlMDBmYjE2MjI0N2ZkOGIxMWExYzZkNjZhOTRlZHAxMA@assured-impala-21347.upstash.io:6379"
// );

const salt = Number(process.env.PASS_SALT);
const passwordChecker = async (plainPassword, hashPassword) => {
  return await bcrypt.compare(plainPassword, hashPassword);
};

export const clearRedisDB = async () => {
  await redisClient.flushdb();

  console.log("Current database has been cleared.");
};

const demoFunAuth = async (req, res) => {
  let sampleJson = { user: "user1" };

  const response = await redisClient.del(["foo", "Pratham"]);

  res.send({ data: response });
};

const signin = async (req, res) => {
  console.log("/signin");
  try {
    const { username, password } = req.body;
    // check in redis
    const redisCheckUser = await redisClient.get(username);

    if (!redisCheckUser) {
      // check in mongo db
      const mongoCheckUser = await userModel_V2.findOne({ username: username });
      if (!mongoCheckUser) throw new Error("user not found");

      // redis set
      await redisClient.set(username, JSON.stringify(mongoCheckUser));
      await redisClient.expire(username, ttl);

      const mongoUserPassword = mongoCheckUser.password;
      if (await passwordChecker(password, mongoUserPassword)) {
        // correct password
        var token = jwt.sign({ username: username }, process.env.SECRET_KEY);
        return res.send({
          success: true,
          statusCode: 200,
          errMessage: "signin successfulL by mongo ",
          token,
        });
      } else {
        // incorrect password
        return res.send({
          success: false,
          statusCode: 200,
          errMessage: "incorrect password by mongo",
        });
      }
    } else {
      const redisUserPassword = JSON.parse(redisCheckUser).password;

      if (await passwordChecker(password, redisUserPassword)) {
        // correct password in redis
        var token = jwt.sign({ username: username }, process.env.SECRET_KEY);
        return res.send({
          success: true,
          statusCode: 200,
          errMessage: "signin successfulL by redis",
          token,
          userinfo: redisCheckUser,
        });
      } else {
        // incorrect password in redis
        return res.send({
          success: false,
          statusCode: 200,
          errMessage: "incorrect password by redis",
        });
      }
    }
  } catch (error) {
    console.error(error);
    res.send({
      success: false,
      statusCode: 400,
      errMessage: error,
    });
  }
};

const signup = async (req, res) => {
  console.log("/signup");
  try {
    const { username, password } = req.body;
    const encrypted_password_from_signup = await encryptor(password, salt);
    const redisCheckUser = await redisClient.get(username);
    if (!redisCheckUser) {
      // check in MONGO DB
      const mongoCheckUser = await userModel_V2.find({ userName: username });

      if (mongoCheckUser.length > 0) {
        await redisClient.set(username, JSON.stringify(mongoCheckUser[0]));
        await redisClient.expire(username, ttl);
        return res.send({
          success: false,
          statusCode: 200,
          errMessage: "user already signed up from Mongo",
        });
      }

      const newUser = {
        username: username,
        password: encrypted_password_from_signup,
        friendList: new Map([]),
      };

      // add to redis
      await redisClient.set(username, JSON.stringify(newUser));
      await redisClient.expire(username, ttl);

      // push to message queue
      // push full operation in the queue

      const newOperation = {
        insertOne: {
          document: newUser,
        },
      };
      useProducer(JSON.stringify(newOperation));
      let token = jwt.sign({ username: username }, process.env.SECRET_KEY);
      return res.send({
        success: true,
        statusCode: 200,
        errMessage: "Signed up successfully",
        token,
      });
    } else {
      return res.send({
        success: false,
        statusCode: 200,
        errMessage: "user already signed up from redis",
      });
    }
  } catch (error) {
    console.error(error);
    return res.send({
      success: false,
      statusCode: 400,
      errMessage: error,
    });
  }
};

export { signup, demoFunAuth, signin };
