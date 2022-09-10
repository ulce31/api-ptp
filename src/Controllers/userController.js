import userModel from "../Models/userModel.js";
import crypto from "crypto";
import Session from "supertokens-node/recipe/session/index.js";

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
    const userInDB = await userModel
      .findOne({
        email,
        password: crypto.createHash("sha256").update(password).digest("hex"),
      })
      .select("-password");
    if (userInDB) {
      //AIM: Store User's role
      await Session.createNewSession(res, userInDB.id);
      /* a new session has been created.
       * - an access & refresh token has been attached to the response's cookie
       * - a new row has been inserted into the database for this new session
       */
      res.status(200).send("Successfully logged ✅");
    }
  } catch (error) {
    console.log(error);
  }
};

export default { register, login };
