import { NextFunction, Response } from "express";

import UserRoles from "supertokens-node/recipe/userroles";
import { Error as STError } from "supertokens-node/recipe/session";
import { SessionRequest } from "supertokens-node/framework/express";

export enum eRoles {
  Athlete = "ATHLETE",
  Coach = "COACH",
  Admin = "ADMIN",
}
//TODO have more refined permissions

async function createRole(role: string) {
  try {
    if (role in eRoles) {
      const response = await UserRoles.createNewRoleOrAddPermissions(
        `${role}`,
        []
      );
      if (response.createdNewRole === false) {
        //TODO: Uncomment when commiting
        /* console.log("ALREADY CREATED ❌"); */
      }
    }
  } catch (error) {
    console.log(error);
  }
}

async function addRoleToUser(
  userId: string,
  role: string
): Promise<string | void> {
  try {
    if (role in eRoles) {
      const response = await UserRoles.addRoleToUser(userId, `${role}`);

      if (response.status === "UNKNOWN_ROLE_ERROR") {
        console.log("UserRole - addRoleToUser \nresponse.status");
        return;
      }

      if (response.didUserAlreadyHaveRole === true) {
        const errorMessage =
          "UserRole - addRoleToUser \nresponse.didUserAlreadyHaveRole";
        console.error(errorMessage);
        return errorMessage;
      }
    }
  } catch (error) {}
}
async function removeRoleFromUser(userId: string, role: string) {
  try {
    if (role in eRoles) {
      const response = await UserRoles.removeUserRole(userId, `${role}`);
    }
  } catch (error) {}
}

const isWriteRole =
  (allowsRoles: string[]) =>
  async (req: SessionRequest, res: Response, next: NextFunction) => {
    try {
      let userId = req.session!.getUserId();
      let { roles: userRoles } = await UserRoles.getRolesForUser(userId);
      for (let aUserRole in userRoles) {
        if (aUserRole in allowsRoles) {
          next();
        }
      }
    } catch (error) {
      res.status(500).json({ error });
    }
  };

export default { createRole, addRoleToUser, removeRoleFromUser, isWriteRole };
