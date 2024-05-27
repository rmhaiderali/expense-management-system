import express from "express";
import multer from "multer";
import {
  loginControllers,
  registerControllers,
  setAvatarController,
  verifyUser,
  verifyEmail,
} from "../controllers/UserController.js";

const upload = multer({ dest: "temp/" });
const router = express.Router();

router.route("/register").post(registerControllers);

router.route("/login").post(loginControllers);

router.route("/verifyEmail").post(verifyEmail);

router
  .route("/setAvatar")
  .post(verifyUser, upload.single("image"), setAvatarController);

export default router;
