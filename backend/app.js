import express from "express";
import cors from "cors";
import { connectDB } from "./db/Database.js";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import transactionRoutes from "./routers/TransactionsRouter.js";
import userRoutes from "./routers/UserRouter.js";
import path from "path";

dotenv.config({ path: ".env" });
const app = express();

const port = process.env.PORT;

await connectDB();
app.use(cors({ origin: process.env.FRONTEND_URL }));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("uploads"));

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

app.use(morgan("dev"));

// Router
app.use("/api/v1", transactionRoutes);
app.use("/api/auth", userRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("../frontend/dist"));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve("../frontend/dist/index.html"))
  );
}

app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
