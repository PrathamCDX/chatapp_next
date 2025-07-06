import express from "express";
import msgModel from "../models/msg.js";
import friendModel from "../models/friends.js";
import userModel from "../models/user.js";
import { error } from "console";

const dataRouter = express.Router();

// /post update seen messages(  )

dataRouter.post("/updateSeen", async (req, res) => {
  try {
    const { username, friendname } = req.body;

    if (username == friendname) {
      throw "username and friendname can not be same";
    }

    if (!username || !friendname) {
      throw "username or friendname can not be empty";
    }

    let test = await friendModel.findOne(
      {
        userName: username,
        "friendList.friendName": friendname,
      },
      {
        userName: 1,
        friendList: { $elemMatch: { friendName: friendname } },
      }
    );

    test.friendList[0].seenStatus = true;
    await test.save();
    return res.send({
      success: true,
      statusCode: 200,
      errMessage: "seen status updated",
    });
  } catch (err) {
    console.error(err);
    return res.send({
      success: false,
      statusCode: 500,
      path: "/data/updateSeen",
      errMessage: err,
    });
  }
});

// /post add friends(  )
dataRouter.post("/addFriends", async (req, res) => {
  console.log("addFriends");
  try {
    const { username, friendname } = req.body;

    if (!username || !friendname) {
      throw "username and friendname can not be same";
    }

    if (username === friendname) {
      throw "Friend name can not be same as username";
    }

    let user = await friendModel.findOne({ userName: username });
    let friend = await friendModel.findOne({ userName: friendname });
    let check = await friendModel.findOne(
      {
        userName: username,
        "friendList.friendName": friendname,
      },
      {
        userName: 1,
        friendList: { $elemMatch: { friendName: friendname } },
      }
    );
    // check for user
    if (!user) {
      user = new friendModel({
        userName: username,
        friendList: [
          {
            friendName: friendname,
            seenStatus: false,
          },
        ],
      });
    } else {
      if (check) {
        return res.send({
          success: true,
          statusCode: 200,
          errMessage: "Already added",
        });
      }
      user.friendList.push({ friendName: friendname, seenStatus: false });
      // friend.list.push(username);
    }

    // check for friend
    if (!friend) {
      friend = new friendModel({
        userName: friendname,
        friendList: [
          {
            friendName: username,
            seenStatus: false,
          },
        ],
      });
    } else {
      friend.friendList.push({
        friendName: username,
        seenStatus: false,
      });
    }
    await user.save();
    await friend.save();

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
});

// /post send messages(  )
dataRouter.post("/sendmsg", async (req, res) => {
  console.log("sendmsg");
  try {
    const { username, friendname, message } = req.body;
    // console.log(req.body);
    let senderChat = await msgModel.findOne({
      userName: username,
      friendName: friendname,
    });
    let recieverChat = await msgModel.findOne({
      userName: friendname,
      friendName: username,
    });

    if (!senderChat) {
      senderChat = new msgModel({
        userName: username,
        friendName: friendname,
        chat: ["0" + message],
      });
    } else {
      senderChat.chat.push("0" + message);
    }

    if (!recieverChat) {
      recieverChat = new msgModel({
        userName: friendname,
        friendName: username,
        chat: ["1" + message],
      });
    } else {
      recieverChat.chat.push("1" + message);
    }

    await senderChat.save();
    await recieverChat.save();
    return res.send({
      success: true,
      statusCode: 200,
      errMessage: "msg sent",
    });
  } catch (err) {
    console.log(err);
    return res.send({
      success: false,
      statusCode: 500,
      path: " msg not send /data/sendmsg",
      errMessage: err,
    });
  }
});

// /get  friend list (  )
dataRouter.post("/friendList", async (req, res) => {
  console.log("friendList");
  try {
    // console.log("/friendlist");
    // console.log(req);
    // return;
    const { username } = req.body;
    let friendListObject = await friendModel.findOne({
      userName: username,
    });
    if (!friendListObject) {
      friendListObject = await new friendModel({
        userName: username,
        friendList: [],
      });

      await friendListObject.save();
      return res.send({
        success: true,
        statusCode: 200,
        data: [],
        errMessage: "fetched new succesfully",
      });
    }

    return res.send({
      success: true,
      statusCode: 200,
      data: friendListObject.friendList,
      errMessage: "fetched succesfully",
    });
  } catch (error) {
    console.error(error);
    res.send({
      success: false,
      statusCode: 500,
      path: "/data/friendList",
      errMessage: error,
    });
  }
});

// /get  chat messages (  )
dataRouter.post("/getChat", async (req, res) => {
  console.log("getChat");
  try {
    const { username, friendname } = req.body;
    let chatListObject = await msgModel.findOne({
      userName: username,
      friendName: friendname,
    });

    if (!chatListObject) {
      chatListObject = await new msgModel({
        userName: username,
        friendName: friendname,
        chat: [],
      });

      await chatListObject.save();
      return res.send({
        success: true,
        statusCode: 200,
        data: [],
        errMessage: "fetched new succesfully",
      });
    }

    return res.send({
      success: true,
      statusCode: 200,
      data: chatListObject.chat,
      errMessage: "fetched succesfully",
    });
  } catch (error) {
    console.error(error);
    console.log("/data/getChat");
    return res.send({
      success: false,
      statusCode: 500,
      path: "/data/getChat",
      errMessage: error,
    });
  }
});

// /get user search (  )
dataRouter.post("/getUser", async (req, res) => {
  console.log("getUser");
  try {
    const { username } = req.body;
    const user = await userModel.findOne({
      userName: username,
    });

    if (!user) {
      return res.send({
        success: false,
        statusCode: 200,
        data: undefined,
        errMessage: "no user found ",
      });
    }

    return res.send({
      success: true,
      statusCode: 200,
      data: user.userName,
      errMessage: "user found",
    });
  } catch (error) {
    console.error(error);
    return res.send({
      success: false,
      statusCode: 500,
      path: "/data/getUser",
      errMessage: error,
    });
  }
});
//

dataRouter.post("/demo", (req, res) => {
  res.send("-data-demo");
});

export default dataRouter;
