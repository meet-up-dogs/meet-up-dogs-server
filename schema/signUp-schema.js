import { body } from "express-validator";

export const signUpSchema = [
  body("email")
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("has to be valid Email"),

  body("password")
    .isLength({ min: 5 })
    .withMessage("has to have at least 5 characters"),

  body("username")
    .escape()
    .contains(" ")
    .withMessage("Please provide first and last name"),
];
