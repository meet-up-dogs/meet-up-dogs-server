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
import e from "express";

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
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("save", async (data) => {
    const { conversation, room, username } = data;
    console.log("conversation: ", [...conversation]);
    let myUser = await userModel.updateOne(
      { username: username },
      {
        [`chats.${room}`]: [...conversation],
      },
      { runValidators: true }
    );
    console.log(myUser);
    // let myUser = await userModel.findOne({ username: username });

    // myUser.chats = {
    //   ...myUser.chats,
    //   [room]: [...conversation],
    // };
    // myUser.chats[room] = [...conversation];
    // console.log("myUser.chats: ", myUser.chats);
    // await myUser.save();
  });
});

// server.listen(port, () => {
//   console.log("server listening on port 3001");
// });
if (await connectToMongoose()) {
  server.listen(port, (err) => {
    if (err) console.error(err);
    console.log(`listening to Port ${port}`);
  });
}
