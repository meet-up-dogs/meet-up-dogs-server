import UserModel from "../models/user-model.js";

export const conversation = async (req, res) => {
  console.log(req.body);
  res.send("conversation");
};
