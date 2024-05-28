import mongoose from "mongoose";

export const connectDB = async () => {
  const { log, error } = console;

  mongoose.connection.on("error", (err) => error(err));

  mongoose.connection.once("open", () => log("MongoDB Connected Successfully"));

  await mongoose.connect(process.env.MONGODB_URI);
};
