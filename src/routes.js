import { Router } from "express";

const router = Router();

router.get("/", function testRoute(req, res) {
  res.send("TEST route");
});

export default router;
