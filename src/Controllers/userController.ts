import UserRoleClaim from "supertokens-node/recipe/userroles";
import PermissionClaim from "supertokens-node/recipe/userroles";
import { Error as STError } from "supertokens-node/recipe/session";
import { SessionRequest } from "supertokens-node/framework/express";

import { Request, Response } from "express";

import userModel from "../Models/userModel.js";
import crypto from "crypto";
import Session from "supertokens-node/recipe/session/index.js";
import UserRoles from "supertokens-node/recipe/userroles";
import Roles, { eRoles } from "../Roles/index.js";

const register = async (req: Request, res: Response) => {
  try {
    let { email, password, role = eRoles.Athlete } = req.body;
    password = crypto.createHash("sha256").update(password).digest("hex");
    const newUser = new userModel({
      email,
      password,
    });
    let createdUser = await newUser.save();
    await Roles.addRoleToUser(createdUser["_id"]!.toString(), role);
    res.status(201).send("Successfully registed ✅");
  } catch (error) {
    console.error(error);
    res.send({ error });
  }
};

const login = async (req: Request, res: Response) => {
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
    } else {
      res.status(404).send("User Not Find 🤷‍♂️");
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send(
        "Houston... The server have a problem. Seriously contact the administrator"
      );
  }
};

const setUserRole = async (req: Request, res: Response) => {
  try {
    let { role, userId } = req.body;
    await Roles.addRoleToUser(userId, role);
    res.status(201).send(`UserId : ${userId}; Role ajouté: ${role}`);
  } catch (error) {
    console.log(error);
    res.status(500).send(`Server Error \nSever error : ${error}`);
  }
};

const readRolesFromSession = async (req: SessionRequest, res: Response) => {
  try {
    console.log("readRolesFromSession - HERE");
    const userId = req.session!.getUserId();
    const { roles } = await UserRoles.getRolesForUser(userId);
    res.status(200).send(roles);
    return;
  } catch (error) {
    console.log(error);
  }
};

export default { register, login, setUserRole, readRolesFromSession };
