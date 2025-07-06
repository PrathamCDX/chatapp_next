import express from "express";
import userModel from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import encrypt from "encryptjs";
const authRouter = express.Router();

// encryptor
const secretKey = process.env.SECRET_KEY;
const salt = Number(process.env.PASS_SALT);
export const encryptor = async (password, salt) => {
  const hash = await bcrypt.hash(password, salt);

  return hash;
};

// sign in
authRouter.post("/signin", async (req, res) => {
  console.log("signin");
  try {
    const { username, password } = req.body;
    console.log(password);
    const checkUser = await userModel.findOne({ userName: username });
    if (!checkUser) throw new Error("user not found");
    console.log(checkUser);
    const encrypted_password_from_signin = password;
    const encrypted_password_from_db = checkUser.password;
    //   console.log(checkUser.password);
    bcrypt.compare(
      encrypted_password_from_signin,
      encrypted_password_from_db,
      function (err, result) {
        if (result) {
          var token = jwt.sign({ username: username }, process.env.SECRET_KEY);

          return res.send({
            success: true,
            statusCode: 200,
            errMessage: "signin successfulL ",
            token,
          });
        } else {
          return res.send({
            success: false,
            statusCode: 200,
            errMessage: "incorrect password",
          });
        }
      }
    );
  } catch (err) {
    console.error(err);
    res.send({
      success: false,
      statusCode: 400,
      errMessage: err,
    });
  }
});

// sign up
authRouter.post("/signup", async (req, res) => {
  console.log("signup");
  try {
    const { username, password } = req.body;
    const encrypted_password_from_signup = await encryptor(password, salt);
    const checkUser = await userModel.find({ userName: username });

    if (checkUser.length > 0) {
      return res.send({
        success: false,
        statusCode: 200,
        errMessage: "user already signed up",
      });
    }

    const saveTest = await new userModel({
      userName: username,
      password: encrypted_password_from_signup,
    });

    await saveTest.save().then(() => {
      var token = jwt.sign({ username: username }, process.env.SECRET_KEY);
      return res.send({
        success: true,
        statusCode: 200,
        errMessage: "Signed up successfully",
        token,
      });
    });
  } catch (err) {
    console.error(err);
    return res.send({
      success: false,
      statusCode: 400,
      errMessage: err,
    });
  }

  res.send();
});

export default authRouter;
