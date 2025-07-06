// username
// password
// friendList
//      friendname
//          chat

import mongoose from "mongoose";

const userSchema_V2 = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  friendList: {
    type: Map,
    of: [String] | null,
    required: false,
  },
});

const userModel_V2 = mongoose.model("userModel_V2", userSchema_V2);
export default userModel_V2;
