import mongoose from "mongoose";

export const connectDB = async () => {
  mongoose.connection.on("error", (err) => console.error(err));

  mongoose.connection.once("open", () =>
    console.log("MongoDB Connected Successfully")
  );

  await mongoose.connect(process.env.MONGODB_URI);
};
