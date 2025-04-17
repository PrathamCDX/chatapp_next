// const mongoose = require("mongoose");
import mongoose from "mongoose";
import { type } from "os";

const msgSchema = mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  friendName: {
    type: String,
    required: true,
  },
  chat: {
    type: Array,
    // 0 sending
    // 1 recieving
    required: true,
  },
});

//
const msgModel = mongoose.model("msgModel", msgSchema);
export default msgModel;
// module.exports
