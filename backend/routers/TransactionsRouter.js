import express from "express";
import multer from "multer";
import { verifyUser } from "../controllers/UserController.js";
import {
  addTransactionController,
  deleteTransactionController,
  getAllTransactionController,
  updateTransactionController,
} from "../controllers/TransactionController.js";
const upload = multer({ dest: "temp/" });
const router = express.Router();

router
  .route("/addTransaction")
  .post(verifyUser, upload.single("image"), addTransactionController);

router.route("/getTransaction").post(verifyUser, getAllTransactionController);

router
  .route("/deleteTransaction/:id")
  .post(verifyUser, deleteTransactionController);

router
  .route("/updateTransaction/:id")
  .put(verifyUser, updateTransactionController);

export default router;
