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
  role: eRoles
): Promise<string | void> {
  if (Object.values(eRoles).includes(role)) {
    const response = await UserRoles.addRoleToUser(userId, `${role}`);
    if (response.status === "UNKNOWN_ROLE_ERROR") {
      return `UserRole - addRoleToUser \n${response.status}`;
    }

    if (response.didUserAlreadyHaveRole === true) {
      const errorMessage =
        "UserRole - addRoleToUser \nresponse.didUserAlreadyHaveRole";
      console.error(errorMessage);
      return errorMessage;
    }
  }
}
async function removeRoleFromUser(userId: string, role: eRoles) {
  if (Object.values(eRoles).includes(role)) {
    const response = await UserRoles.removeUserRole(userId, `${role}`);
    return response;
  }
}

const isWriteRole =
  (allowsRoles: eRoles[]) =>
  async (req: SessionRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.session!.getUserId();
      console.log(userId);
      const { roles: userRoles } = await UserRoles.getRolesForUser(userId);

      const foundRole = allowsRoles.reduce((acc, aRole) => {
        return acc || userRoles.includes(aRole);
      }, false);

      if (foundRole) {
        next();
      } else {
        res.status(403).json("Access Forbidden");
      }
    } catch (error) {
      res.status(500).json({ error });
    }
  };

export default { createRole, addRoleToUser, removeRoleFromUser, isWriteRole };
