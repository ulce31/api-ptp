import userModel from "../Models/userModel.js";
const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const newUser = new userModel({
      email,
      password,
    });
    await newUser.save();
    const users = await userModel.find();
    res.send({ users });
    console.log(users);
  } catch (error) {
    let errorMessage;
    switch (error.code) {
      case 11000:
        errorMessage = "Email already registered";
        break;
      default:
    }
    res.send({ errorMessage });
  }
};

export default { register };
