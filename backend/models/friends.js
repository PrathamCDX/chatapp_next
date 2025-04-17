// const mongoose = require("mongoose");
import mongoose from "mongoose";

const friendSchema = mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  friendList: [
    {
      friendName: {
        type: String,
        required: true,
      },
      seenStatus: {
        type: Boolean,
        required: true,
      },
    },
  ],
});

const friendModel = mongoose.model("friendModel", friendSchema);
export default friendModel;
// module.exports
