import UserRoles from "supertokens-node/recipe/userroles/index.js";

const roles = ["ATHLETE", "COACH", "ADMIN"];
//TODO have more refined permissions

async function createRole(role) {
  try {
    if (roles.includes(role)) {
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

async function addRoleToUser(userId, role) {
  try {
    if (roles.includes(role)) {
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
async function removeRoleFromUser(userId, role) {
  try {
    if (roles.includes(role)) {
      const response = await UserRoles.removeUserRole(userId, `${role}`);
    }
  } catch (error) {}
}

async function isWriteRole(req, res, next) {
  const roles = await req.session.getClaimValue(UserRoles.UserRoleClaim);

  if (roles === undefined || !roles.includes(allowedRoles)) {
    // this error tells SuperTokens to return a 403 to the frontend.
    throw new STError({
      type: "INVALID_CLAIMS",
      message: "User is not an admin",
      payload: [
        {
          id: UserRoles.UserRoleClaim.key,
        },
      ],
    });
  } else {
    next();
  }
}

export default { createRole, addRoleToUser, removeRoleFromUser, isWriteRole };
