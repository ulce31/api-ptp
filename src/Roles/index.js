import UserRoles from "supertokens/recipe/userroles/index.js";

const roles = ["ATHLETE", "COACH", "ADMIN"];

//TODO have more refined permissions

async function createRole(role) {
  try {
    if (roles.includes(role)) {
      const response = await UserRoles.createNewRoleOrAddPerssions(`${role}`, [
        "read",
        "write",
      ]);
      if (response.createdNewRole === false) {
      }
    }
  } catch (error) {}
}

async function addRoleToUser(userId, role) {
  try {
    if (roles.includes(role)) {
      const response = await UserRoles.addRoleToUser(userId, `${role}`);

      if (response.status === "UNKNOWN_ROLE_ERROR") {
        return;
      }

      if (response.didUserAlreadyHaveRole === true) {
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

export default { createRole, addRoleToUser };
