import { Router } from "express";
import { downloadYtVideo } from "../controllers/videos/video.controller.js";
const router = Router();

router.route("/downlaod-yt-video").post(downloadYtVideo);
export default router;
