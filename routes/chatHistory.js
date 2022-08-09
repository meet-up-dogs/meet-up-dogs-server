import ChatModel from "../models/chat-model.js";

export const chatHistory = async (req, res) => {
  const { username, room } = req.body;
  try {
    const myChat = await ChatModel.findOne({ roomId: room });

    res.send({ chat: myChat?.chat, sentAt: myChat?.sentAt });
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
};
