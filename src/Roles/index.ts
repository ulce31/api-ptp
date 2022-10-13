import { NextFunction } from "express";
import UserRoles from "supertokens-node/recipe/userroles";
import { Error as STError } from "supertokens-node/recipe/session";

enum Roles {
  Athlete,
  Coach,
  Admin,
}
//TODO have more refined permissions

async function createRole(role: string) {
  try {
    if (role in Roles) {
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
    if (role in Roles) {
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
    if (role in Roles) {
      const response = await UserRoles.removeUserRole(userId, `${role}`);
    }
  } catch (error) {}
}

export default { createRole, addRoleToUser, removeRoleFromUser };
