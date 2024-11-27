import { Router } from "express";
import { createUser, signInUser } from "../controllers/users/user.controller.js";
const router = Router();
router.route("/create-user").post(createUser);
router.route("/signin").post(signInUser);
export default router;
