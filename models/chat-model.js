import mongoose from "mongoose";
const Schema = mongoose.Schema;

const chatSchema = new Schema({
  roomId: {
    type: String,
    unique: true,
    required: true,
  },
  chat: {
    type: Array,
  },
});

export default mongoose.model("Chat", chatSchema);
