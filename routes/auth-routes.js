import express from "express";
import {
  postLogin,
  postSignUp,
  postLogout,
  userProfil,
} from "../controllers/auth-controller.js";
import { loginSchema } from "../schema/login-schema.js";
import { signUpSchema } from "../schema/signUp-schema.js";
import { algorithm } from "./match-algorithm.js";
import { conversation } from "./conversation.js";
import { chatHistory } from "./chatHistory.js";
import { chats } from "./chats.js";
import isAuth from "../middleware/is-auth.js";
const router = express.Router();

router.post("/signup", postSignUp, signUpSchema);
router.post("/login", postLogin, loginSchema);
router.post("/userprofil", userProfil);
router.post("/refreshToken");
router.post("/logout", postLogout);
router.get("/getMatchedUsers", isAuth, algorithm);
router.post("/sendConversation", isAuth, conversation);
router.post("/getChatHistory", chatHistory);
router.get("/getChats", isAuth, chats);

export default router;
