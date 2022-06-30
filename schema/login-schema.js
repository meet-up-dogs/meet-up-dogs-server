import { body} from "express-validator"

export const loginSchema = [
    body("email")
    .trim()
    .isEmail()
    .withMessage("has to be valid Email")
    .normalizeEmail,

    body("password")
    .isLength({min: 5})
    .withMessage("has to have at least 5 characters")
]