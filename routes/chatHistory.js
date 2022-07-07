import UserModel from "../models/user-model.js";

export const chatHistory = async (req, res) => {
  const { username, room } = req.body;
  try {
    const myUser = await UserModel.findOne({ username: username }).select({
      chats: 1,
      _id: false,
    });
    const myChat = myUser.chats[room];
    res.send({ room: room, chat: myChat });
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
  //   console.log(myChat);
};
