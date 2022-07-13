import express from "express";
import "dotenv/config";
import cors from "cors";
import connectToMongoose from "./util/connect-to-mongoose.js";
import apiRoutes from "./routes/api-routes.js";
import authRoutes from "./routes/auth-routes.js";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import { createServer } from "http";
import userModel from "./models/user-model.js";
import chatModel from "./models/chat-model.js";
import nodemailer from "nodemailer"

const port = process.env.PORT || 8080;
const app = express();
// app.set("https://meet-up-dogs.netlify.app", 1);
// console.log("as");
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    // origin: "https://meet-up-dogs.netlify.app",
    origin: "http://localhost:3000",

    credentials: true,
  })
);

const server = createServer(app);
const io = new Server(server, {
  cors: {
    // origin: "https://meet-up-dogs.netlify.app",
    origin: "http://localhost:3000",

    methods: ["GET", "POST"],
  },
});

// io.use(cors())

app.get("/", (req, res) => {
  res.send(`<h1>Welcome on Meet Up Dogs App-Server</h1> ${port}`);
});

app.use(apiRoutes);
app.use(authRoutes);

io.on("connection", (socket) => {
  // console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
  });

  socket.on("send_message", async (data) => {
    let myChat = await chatModel.findOne({ roomId: data.room });
    // console.log(myChat);

    if (myChat !== null) {
      myChat.chat.push({
        sentBy: data.username,
        msg: data.message,
      });
      // myChat.chat = [];

      myChat.save();
    } else {
      // console.log("saved");
      const newChat = await new chatModel({
        roomId: data.room,
        chat: [{ sentBy: data.username, msg: data.message }],
      });
      newChat.save();
    }

    socket.to(data.room).emit("receive_message", data);
  });

  //OFFLINE

  // const { conversation, room, username } = data;
  // let myUser = await userModel.updateOne(
  //   { username: username },
  //   {
  //     [`chats.${room}`]: [...conversation],
  //   },
  //   { runValidators: true }
  // );
  // let myUser = await userModel.findOne({ username: username });

  // myUser.chats = {
  //   ...myUser.chats,
  //   [room]: [...conversation],
  // };
  // myUser.chats[room] = [...conversation];
  // console.log("myUser.chats: ", myUser.chats);
  // await myUser.save();
});
// });

// server.listen(port, () => {
//   console.log("server listening on port 3001");
// });

app.post("/contact", (req, res ,next) => {
  console.log("hello")
  const comment = req.body
  console.log(comment)
  res.send(comment)

  const outPut = `
    <p>Thank You For your Msg</p>
    <h3>Contact Details</h3>
    <ul>
      <li>Name: ${req.body.user}</li>
      <li>Email: ${req.body.email}</li>
      <li>Msg: ${req.body.msg}</li>
    </ul>
  `;
  let transporter = nodemailer.createTransport({
    host: "localhost",
    secure: false, // true for 465, false for other ports
    auth: {
      user: req.body.email, // generated ethereal user
      // pass: "1234", // generated ethereal password
    },
    tls:{
      rejectUnauthorized: false
    }
  });

  let mailOption = {
    from: req.body.email, // sender address
    to: 'faridztvki@gmail.com', // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: outPut, // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOption,(error, info)=>{
    if(error){
      return console.log(error)
    }
    console.log("Message send: %s", info.messageId)
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))
    res.send("it works")

  });
})


if (await connectToMongoose()) {
  server.listen(port, (err) => {
    if (err) console.error(err);
    console.log(`listening to Port ${port}`);
  });
}
