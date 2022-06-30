import express from "express";
import "dotenv/config";
import cors from "cors";
import connectToMongoose from "./util/connect-to-mongoose.js";
import apiRoutes from "./routes/api-routes.js";
import authRoutes from "./routes/auth-routes.js";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import { createServer } from "http";

const port = process.env.PORT || 8080;
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

const server = createServer(app);
const io = new Server(server, {
  cors: {
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
