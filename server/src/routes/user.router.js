import { Router } from "express";
import {
  createUser,
  signInUser,
  userAssets,
} from "../controllers/users/user.controller.js";
import { validateAuth } from "../middleweres/auth.js";
const router = Router();

router.route("/create-user").post(createUser);
router.route("/signin").post(signInUser);
router.route("/store").get(validateAuth, userAssets);

export default router;
