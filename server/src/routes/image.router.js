import { Router } from "express";
import { upload } from "../utilities/multer.js";
const router = Router();
import { imageConvert } from "../controllers/images/image.controller.js";
import { validateAuth } from "../middleweres/auth.js";

router.route("/change-formate").post(upload.single("image"),validateAuth, imageConvert);

export default router;
