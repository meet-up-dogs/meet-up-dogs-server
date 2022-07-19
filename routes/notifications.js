import ChatModel from "../models/chat-model.js";

// export const notifications = async (req, res) => {
//   //   console.log(req.userName, "uuuuuuuuuuuuserrrrrr:");
//   const userName = req.userName.toLowerCase();
//   try {
//     const chats = await ChatModel.find({});
//     // console.log("mychats: ", myChats);
//     const myChats = chats.filter((chat) => {
//       const myRoom = chat.roomId.split("-");
//       return myRoom.includes(userName) ? chat : null;
//       // console.log("heee: ", req.userName);
//     });
//     res.send(myChats);
//   } catch (e) {
//     console.log(e);
//     res.status(400).json(e);
//   }
//   console.log(myChat);
// };
