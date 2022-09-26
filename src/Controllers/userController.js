import userModel from "../Models/userModel.js";
import crypto from "crypto";
import Session from "supertokens-node/recipe/session/index.js";
import UserRoles from "supertokens-node/recipe/userroles/index.js";
import Roles from "../Roles/index.js";

const register = async (req, res) => {
  try {
    let { email, password, role } = req.body;
    password = crypto.createHash("sha256").update(password).digest("hex");
    const newUser = new userModel({
      email,
      password,
    });
    let createdUser = await newUser.save();
    await Roles.addRoleToUser(createdUser["_id"], role);
    res.status(201).send("Successfully registed ✅");
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

const setUserRole = async (req, res) => {
  try {
    let { role, userId } = req.body;
    //#1 Set role
    await Roles.addRoleToUser(userId, role);
    res.status(201).send(`UserId : ${userId}; Role ajouté: ${role}`);

    //#2 Check role
  } catch (error) {
    console.log(error);
    res.status(500).send(`Server Error \nSever error : ${error}`);
  }
};

const readRolesFromSession = async (req, res) => {
  try {
    let userId = req.session.getUserId();
    let roles = await UserRoles.getRolesForUser(userId);
    console.log(roles);
    res.status(200).send({ roles });
  } catch (error) {
    console.log(error);
  }
};

export default { register, login, setUserRole, readRolesFromSession };
