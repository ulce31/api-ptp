import { Router } from "express";
import userController from "./Controllers/userController.js";

const router = Router();

router.get("/", function testRoute(req, res) {
  res.send("TEST route");
});

router.post("/register", userController.register);

export default router;
