import express from "express";
import {
  demoFunAuth,
  signin,
  signup,
} from "../../controllers/v2/auth.controllers.js";

const authRouterV2 = express.Router();

authRouterV2.get("/", demoFunAuth);

// signin
authRouterV2.post("/signin", signin);

// signup
authRouterV2.post("/signup", signup);

export { authRouterV2 };
