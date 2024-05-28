import express from "express";
import { connectDB } from "./db/Database.js";
import transactionRoutes from "./routers/TransactionsRouter.js";
import userRoutes from "./routers/UserRouter.js";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

const router = express.Router();

await connectDB();

// Middleware
router.use(express.json());
router.use(express.urlencoded({ extended: false }));
router.use(express.static("uploads"));

// router.use(cors());
// router.use(helmet());
// router.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
// router.use(morgan("dev"));

// Router
router.use("/api/v1", transactionRoutes);
router.use("/api/auth", userRoutes);

export default router;
