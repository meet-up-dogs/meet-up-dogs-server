import { body } from "express-validator";
import UserModel from "../models/user-model.js";

export const signUpSchema = [
  body("email")
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("has to be valid Email"),

  body("password")
    .trim()
    .isLength({ min: 5 })
    .withMessage("has to have at least 5 characters"),

  body("username").custom(async (value) => {
    const isUser = await UserModel.findOne({ username: value });
    console.log("usererrrrere,.:", isUser);
    if (isUser) {
      return await Promise.reject("Username already taken");
    }
  }),
  // .withMessage("Please provide first and last name"),
];
