import { body } from "express-validator";
import UserModel from "../models/user-model.js";

export const signUpSchema = [
  body("email")
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("has to be valid Email"),

  body("password")
    .isLength({ min: 5 })
    .withMessage("has to have at least 5 characters"),

  body("username").custom((value) => {
    return UserModel.findOne({ where: { username: value } }).then(() => {
      return Promise.reject("Username already taken");
    });
  }),
  // .withMessage("Please provide first and last name"),
];
