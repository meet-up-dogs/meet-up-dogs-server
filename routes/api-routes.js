import express from "express";
import isAuth from "../middleware/is-auth.js";
import UserModel from "../models/user-model.js";

const router = express.Router();

router.post("/json", (req, res) => {
  res.json({
    success: true,
    data: { email: req.body.email, password: req.body.pwd },
  });
});

router.get("/getUser", isAuth, (req, res) => {
  //   res.json({
  //     success: true,
  //     secretMessage: `${req.userName}, die Antwort auf die große Frage.... `,
  //   });
  try {
    res.send({ logging: true, username: req.userName, userId: req.userId });
  } catch (err) {
    console.log(err);
  }
});

router.get("/currentUser", isAuth, async (req, res) => {
  console.log("curUse:", req.userName);

  const loggedUser = await UserModel.findOne({ username: req.userName });

  console.log("loggedUser", loggedUser);
  res.send(loggedUser);
});
export default router;
