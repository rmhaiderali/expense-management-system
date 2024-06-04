import fs from "fs";
import User from "../models/UserModel.js";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";
import aproveUserEmailTemplate from "../utils/aproveUserEmailTemplate.js";
import resetPasswordEmailTemplate from "../utils/resetPasswordEmailTemplate.js";

const JWT_Key = process.env.JWT_SECRET;

export const verifyUser = async (req, res, next) => {
  const token = req.get("x-access-token") || req.get("Authorization");

  if (!token) {
    return res.json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    const decoded = JWT.verify(token.slice(7), process.env.JWT_SECRET);
    req.user = decoded;
    console.log(decoded);
    next();
  } catch (err) {
    return res.json({
      success: false,
      message: "Invalid Token",
    });
  }
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, UserType } = req.body;

    if (!name || !email || !password || !UserType) {
      return res.json({
        success: false,
        message: "Please enter All Fields",
      });
    }

    let user = await User.findOne({ email });

    if (user) {
      return res.json({
        success: false,
        message: "User already Exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      UserType,
    });

    const generatedToken = JWT.sign(
      { id: newUser._id, action: "approveUser" },
      JWT_Key
    );

    await sendEmail(
      process.env.APPROVER_EMAIL,
      "Tafawuq Gulf: Approve User",
      aproveUserEmailTemplate(generatedToken, name, email, UserType)
    );

    return res.json({
      success: true,
      message:
        "Your account has been created successfully. You will be able to login after your account is approved by the admin.",
      dashboard: newUser.UserType,
    });
  } catch (err) {
    return res.json({
      success: false,
      message: err.message,
    });
  }
};

export const approve = async (req, res, next) => {
  try {
    const { emailToken } = req.body;

    if (!emailToken) {
      return res.json({
        success: false,
        message: "No token is provided",
      });
    }

    let decodedToken;
    try {
      decodedToken = JWT.verify(emailToken, JWT_Key);
    } catch (error) {}

    if (!decodedToken) {
      return res.json({
        success: false,
        message: "Invalid Token",
      });
    }

    if (decodedToken.action !== "approveUser") {
      return res.json({
        success: false,
        message: "Invalid Action",
      });
    }

    const user = await User.findById(decodedToken.id).select("-password");

    if (!user) {
      return res.json({
        success: false,
        message: "User does not exist",
      });
    }

    if (user.isEmailVerified) {
      return res.json({
        success: false,
        message: "User is already approved",
      });
    }

    user.isEmailVerified = true;
    await user.save();

    return res.json({
      success: true,
      message: "User approved successfully",
      dashboard: user.UserType,
    });
  } catch (err) {
    return res.json({
      success: false,
      message: err.message,
    });
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({
        success: false,
        message: "Please enter All Fields",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.isEmailVerified) {
      return res.json({
        success: false,
        message:
          "This account is not approved yet. Ask admin to approve it first.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({
        success: false,
        message: "Incorrect Email or Password",
      });
    }

    user.password = undefined;

    const token = JWT.sign(
      {
        id: user._id,
        email: user.email,
        UserType: user.UserType,
      },
      JWT_Key,
      { expiresIn: "2h" }
    );

    if (user.UserType === "admin") {
      return res.json({
        success: true,
        message: `Welcome back, ${user.name}`,
        user,
        dashboard: "admin",
        token,
      });
    } else {
      return res.json({
        success: true,
        message: `Welcome back, ${user.name}`,
        user,
        dashboard: "user",
        token,
      });
    }
  } catch (err) {
    console.error(err);
    return res.json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const requestResetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.json({
        success: false,
        message: "Please enter All Fields",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.isEmailVerified) {
      return res.json({
        success: false,
        message:
          "This account is not approved yet. Ask admin to approve it first.",
      });
    }

    const generatedToken = JWT.sign(
      { id: user._id, action: "resetPassword" },
      JWT_Key,
      { expiresIn: "2h" }
    );

    await sendEmail(
      email,
      "Tafawuq Gulf: Reset Password",
      resetPasswordEmailTemplate(generatedToken, email)
    );

    return res.json({
      success: true,
      message:
        "Verification email has been sent to your email address. Please check your Inbox.",
      dashboard: user.UserType,
    });
  } catch (err) {
    console.error(err);
    return res.json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { emailToken, newPassword } = req.body;

    if (!emailToken) {
      return res.json({
        success: false,
        message: "No token is provided",
      });
    }

    if (!newPassword) {
      return res.json({
        success: false,
        message: "New password is required",
      });
    }

    let decodedToken;
    try {
      decodedToken = JWT.verify(emailToken, JWT_Key);
    } catch (error) {}

    if (!decodedToken) {
      return res.json({
        success: false,
        message: "Invalid Token",
      });
    }

    if (decodedToken.action !== "resetPassword") {
      return res.json({
        success: false,
        message: "Invalid Action",
      });
    }

    const user = await User.findById(decodedToken.id).select("-password");

    if (!user) {
      return res.json({
        success: false,
        message: "User does not exist",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    return res.json({
      success: true,
      message: "Password changed successfully",
      dashboard: user.UserType,
    });
  } catch (err) {
    return res.json({
      success: false,
      message: err.message,
    });
  }
};

export const setAvatar = async (req, res, next) => {
  try {
    const userId = req.user.id;
    console.log(userId);
    const image = req.file;

    if (!image) {
      return res.json({
        success: false,
        messages: "No image was uploaded",
      });
    }

    if (!["image/png", "image/jpeg"].includes(image.mimetype))
      return res.json({
        success: false,
        messages: "Only png and jpg images are allowed",
      });

    const imageName = Date.now() + "_" + image.originalname;

    fs.rename(image.path, "uploads/" + imageName, (error) => {
      if (error) throw error;
    });

    const userData = await User.findById(userId);

    userData.avatarImage = imageName;
    userData.isAvatarImageSet = true;

    await userData.save();

    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const user = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);

    return res.json(user);
  } catch (err) {
    next(err);
  }
};
