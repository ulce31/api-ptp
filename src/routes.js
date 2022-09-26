import { Router } from "express";
import { verifySession } from "supertokens-node/recipe/session/framework/express/index.js";
import UserRoles from "supertokens-node/recipe/userroles/index.js";
import userController from "./Controllers/userController.js";

const router = Router();

router.get("/", function testRoute(req, res) {
  res.send("TEST route");
});

router.post("/register", userController.register);
router.post("/login", userController.login);

router.post("/set-role", userController.setUserRole);

router.get(
  "/readFS",
  verifySession({
    overrideGlobalClaimValidators: async (globalValidators) => [
      ...globalValidators,
      UserRoles.UserRoleClaim.validator.includes("ATHLETE"),
    ],
  }),
  userController.readRolesFromSession
);

export default router;
