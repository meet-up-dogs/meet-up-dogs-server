import ChatModel from "../models/chat-model.js";

export const chatHistory = async (req, res) => {
  const { username, room } = req.body;
  try {
    const myChat = await ChatModel.findOne({ roomId: room });

    // console.log(myChat.chat);

    res.send({ chat: myChat.chat });
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
  //   console.log(myChat);
};
