import { Router } from "express";
import { upload } from "../utilities/multer.js";
const router = Router();
import { imageConvert } from "../controllers/images/image.controller.js";

router.route("/change-formate").post(upload.array("images"), imageConvert);

export default router;
