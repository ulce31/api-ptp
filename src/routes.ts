import { Router, Request, Response } from "express";
import { verifySession } from "supertokens-node/recipe/session/framework/express/index";
import userController from "./Controllers/userController.js";
import Roles, { eRoles } from "./Roles";

const router = Router();

router.get("/", function testRoute(req: Request, res: Response) {
  res.send("TEST route");
});

router.post("/register", userController.register);
router.post("/login", userController.login);

router.post("/set-role", userController.setUserRole);

router.get(
  "/readFS",
  verifySession(),
  Roles.isWriteRole([eRoles.Athlete, eRoles.Coach]),
  userController.readRolesFromSession
);

export default router;
