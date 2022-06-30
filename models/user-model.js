import mongoose from "mongoose";
import bcrypt from "bcrypt";
const Schema = mongoose.Schema;

const availabilitySchema = new mongoose.Schema({
  dayTime: {
    type: Array,
    default: "",
  },
  weekDay: {
    type: Array,
    default: "",
  },
  _id: false,
});

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
  },
  location: {
    bottomLeft: [],
    topRight: [],
  },
  language: {
    type: String,
  },
  dogBreed: {
    type: String,
  },
  availability: availabilitySchema,

  userImage: {
    type: String,
  },
  createdAt: {
    type: Date,
    immutable: true,
    default: () => new Date(),
  },
  updatedAt: {
    type: Date,
    default: () => new Date(),
  },
  description: {
    type: String,
  },
  chats: {
    type: Array,
  },
});

userSchema.pre("save", async function (next) {
  console.log("UserSchema ist in pre reingegangen");
  this.password = await bcrypt.hash(this.password, 15);
  next();
});

export default mongoose.model("User", userSchema);
