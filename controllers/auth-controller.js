import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/user-model.js";

export const postSignUp = async (req, res) => {
  try {
    const newUser = new UserModel(req.body);
    console.log(newUser);
    await newUser.save();
    return res.status(201).json({ success: true, insertedData: newUser });
  } catch (error) {
    res.status(200).json({ error: error.message });
  }
};

export const userProfil = async (req, res) => {
  try {
    // let accLog = await UserModel.where("username").equals("Karol");
    // const cond = { username: req.body.username };
    // if (accLog) {
    // const newUser = new UserModel(req.body);
    // console.log("newUser bei UserProfil.js", newUser);
    const updatedUser = await UserModel.findOneAndUpdate(
      { username: req.body.username },
      req.body,
      { new: true }
    );
    console.log("updatedUser");
    return res.status(201).json({ success: true, insertedData });
    // }
  } catch (error) {
    res.status(200).json({ error: error.message });
  }
};

const EXPIRATION_ACCESTOKEN = "360m";

export const postLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(401)
      .json({ success: false, error: "Provide Password and Email" });

  const msgUserPwdCombination = "User/Password combination not found";

  let loggingUser;
  try {
    loggingUser = await UserModel.findOne({ email });
    console.log("logginUser is successful", loggingUser);
    if (!loggingUser)
      return res.status(401).json({ error: msgUserPwdCombination });
  } catch (error) {
    console.error(error);
    return res.json({ error: error.message });
  }

  try {
    const isCorrectPassword = await bcrypt.compare(
      password,
      loggingUser.password
    );
    if (!isCorrectPassword)
      return res.status(401).json({ error: msgUserPwdCombination });
  } catch (err) {
    console.error({ error });
    return res.status(500).json({ error });
  }

  const expiresInMs = 24 * 60 * 60 * 1000; // 1 h
  const expiresInDate = new Date(Date.now() + expiresInMs);

  const token = jwt.sign(
    {
      userName: loggingUser.username,
      userId: loggingUser._id,
    },
    process.env.TOKEN_SECRET,
    {
      expiresIn: EXPIRATION_ACCESTOKEN,
    }
  );
  //   debugger;
  res
    .cookie("token", token, { httpOnly: false, sameSite: "none" })
    .send({ logging: true });
  console.log("token", token);
  //   res.send("cookie");
};

/** @param {express.Response} res */
export const postLogout = async (req, res) => {
  // Hatte der Nutzer ein Refresh Token Cookie?
  // const refreshToken = req.cookies?.refreshToken;
  // if (!refreshToken) return res.sendStatus(204); // Wenn cookie nicht da ist, kann man hier auch nicht mehr tun
  // console.log(req);
  // Lösche Cookies beim Client
  res.clearCookie("token");

  // Lösche Refresh Token aus Datenbank
  // try {
  //   const databaseResponse = await UserModel.updateOne({refreshToken}, {refreshToken:''})
  //   // Refresh Token nicht gefunden?
  //   if(databaseResponse.matchedCount === 0) return res.sendStatus(204);
  // } catch (error) {
  //   console.error({error});
  //   return res.status(500).json({ msg: "logged out, but couldn't delete refresh Token from DB", error})
  // }

  // Alles ok: Cookies und erfolgreich aus Datenbank gelöscht
  return res.status(200).send({ msg: "successfully logged out" });
};

/** @param {express.Response} res */
export const postRefreshToken = async (req, res) => {
  // refreshToken cookie vorhanden?
  // kein refresh token cookie => kein neues access token
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken)
    return res.status(401).send({ error: "No refresh token cookie" }); // Unauthorized (keine Anmeldedaten vorhanden)

  // Refresh Token noch in Datenbank?
  // Nein? => "abgelaufen" => kein neues access-token
  let loggedUser;
  try {
    loggedUser = await UserModel.findOne({ refreshToken });
    if (!loggedUser)
      return res.status(403).send({ error: "refresh token not found" }); //Forbidden  (Anmeldedaten vorhanden, aber nicht gültig)
    console.debug({ loggedUser });
  } catch (error) {
    console.error(error);
    return res.json({ error: error.message });
  }

  // Refresh Token verifizieren (vorhanden in Datenbank, aber z.b. abgelaufen?)
  try {
    const decodedJwt = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    // zuätzliche Überprüfung:
    // Befindet sich im Token die gleiche _id wie in der Datebnak beim Nutzer, der das Refresh Token hat?
    if (loggedUser._id.toString() !== decodedJwt.userId)
      return res.sendStatus(403);
  } catch (error) {
    console.error("Refresh Token verify error", error);
    return res.sendStatus(403);
  }

  // Erstelle das neue Access-Token
  const accessToken = jwt.sign(
    {
      userName: loggedUser.name,
      userId: loggedUser._id,
    },
    process.env.TOKEN_SECRET,
    { expiresIn: EXPIRATION_ACCESTOKEN }
  );

  return res.status(200).json({
    msg: "successfully refreshed token",
    accessToken,
    userName: loggedUser.name,
  });
};
