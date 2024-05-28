import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },

  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    validate: validator.isEmail,
  },

  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password Must Be Atleast 6 characters"],
  },

  UserType: {
    type: String,
    required: [true, "User Type is required"],
  },

  isEmailVerified: {
    type: Boolean,
    default: false,
  },

  isAvatarImageSet: {
    type: Boolean,
    default: false,
  },

  avatarImage: {
    type: String,
    default: "",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

delete mongoose.connection.models["User"];
export default mongoose.model("User", userSchema);
