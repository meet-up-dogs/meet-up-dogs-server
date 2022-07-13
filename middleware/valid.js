import { validationResult } from "express-validator";

export default (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("errors: ", errors);
    return res.status(400).json({ errors: errors.array() });
  }
  console.log("hmmm");
  next();
};
