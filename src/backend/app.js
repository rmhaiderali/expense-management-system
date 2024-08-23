import express from "express";
import { connectDB } from "./db/Database.js";
import transactionRoutes from "./routers/TransactionsRouter.js";
import userRoutes from "./routers/UserRouter.js";

await connectDB();

const app = express();

app.use(express.json());
app.use(express.static("uploads"));

app.use("/api/v1", transactionRoutes);
app.use("/api/auth", userRoutes);

export default app;
