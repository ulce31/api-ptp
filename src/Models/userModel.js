import pkg from "mongoose";
const { Schema, model } = pkg;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export default model("Users", userSchema);
