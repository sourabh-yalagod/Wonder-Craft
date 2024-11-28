import { Router } from "express";
import {
  audioFromVideo,
  compressVideo,
  videoFormate,
  ytUrl,
} from "../controllers/videos/video.controller.js";
import { upload } from "../utilities/multer.js";
import { validateAuth } from "../middleweres/auth.js";
upload;
const router = Router();

router.route("/yt-url").post(ytUrl);
router.route("/video-formate").post(upload.single("video"), videoFormate);
router.route("/video-compressor").post(upload.single("video"), compressVideo);
router
  .route("/audio-from-video")
  .post(upload.single("video"), validateAuth, audioFromVideo);

export default router;
