import express from "express";
import multer from "multer";
import {
  verifyUser,
  login,
  register,
  setAvatar,
  approve,
  requestResetPassword,
  resetPassword,
} from "../controllers/UserController.js";

const upload = multer({ dest: "temp/" });
const router = express.Router();

router.route("/register").post(register);

router.route("/approve").post(approve);

router.route("/login").post(login);

router.route("/requestResetPassword").post(requestResetPassword);

router.route("/resetPassword").post(resetPassword);

router.route("/setAvatar").post(verifyUser, upload.single("image"), setAvatar);

export default router;
