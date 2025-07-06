import { error } from "console";
import Redis from "ioredis";

import dotenv from "dotenv";
dotenv.config();

const redisUrl = String(process.env.REDIS_URL);
const redisClient = new Redis(redisUrl);

async function migrateUsersToV2() {
  try {
    const oldUsers = await userModel.find({});
    const newUsers = [];

    for (const user of oldUsers) {
      let friendList = {};
      let friendListObject = await friendModel.findOne({
        userName: user.userName,
      });

      if (friendListObject && Array.isArray(friendListObject.friendList)) {
        for (const friendObject of friendListObject.friendList) {
          if (friendObject) {
            let chatListObject = await msgModel.findOne({
              userName: user.userName,
              friendName: friendObject.friendName,
            });
            const CurrentFriendChat = chatListObject?.chat || [];
            friendList[friendObject.friendName] = CurrentFriendChat;
          }
        }
      }

      newUsers.push({
        username: user.userName,
        password: user.password,
        friendList: friendList,
      });
    }

    await userModel_V2.insertMany(newUsers);
    console.log("Migration complete: users copied to userModel_V2");
  } catch (err) {
    console.error("Migration failed:", err);
  }
}

const setRedis = async (key, value, expiry = 1 * 60 * 60) => {
  if (typeof value != "string") {
    value = JSON.stringify(value);
  }
  try {
    await redisClient.set(key, value);
    await redisClient.expire(key, expiry);

    return true;
  } catch (error) {
    console.log("error in utils/setRedis ", error);
    return false;
  }
};

export { migrateUsersToV2, setRedis };
