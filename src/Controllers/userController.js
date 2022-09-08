import userModel from "../Models/userModel.js";
import crypto from "crypto";

const register = async (req, res) => {
  try {
    let { email, password } = req.body;
    password = crypto.createHash("sha256").update(password).digest("hex");
    const newUser = new userModel({
      email,
      password,
    });
    await newUser.save();
  } catch (error) {
    let errorMessage;
    switch (error.code) {
      case 11000:
        errorMessage = "Email already registered";
        break;
      default:
        console.log(error);
    }
    res.send({ errorMessage });
  }
};

const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    const userInDB = await userModel.findOne({
      email,
      password: crypto.createHash("sha256").update(password).digest("hex"),
    });
    if (userInDB) {
      console.log("logged");
    }
  } catch (error) {
    console.log(error);
  }
};

export default { register, login };
