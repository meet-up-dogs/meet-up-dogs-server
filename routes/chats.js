import ChatModel from "../models/chat-model.js";

export const chats = async (req, res) => {
  const userName = req.userName.toLowerCase();
  try {
    const chats = await ChatModel.find({});

    const myChats = chats.filter((chat) => {
      const myRoom = chat.roomId.split("-");
      return myRoom.includes(userName) ? chat : null;
    });
    res.send(myChats);
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
};
