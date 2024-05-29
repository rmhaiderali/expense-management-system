import fs from "fs";
import User from "../models/UserModel.js";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import sendVerificationEmail from "../utils/sendVerificationEmail.js";

const generateToken = (user, jwtKey, expiresIn) => {
  const payload = {
    id: user._id,
    email: user.email,
    UserType: user.UserType,
  };
  const token = Jwt.sign(payload, jwtKey, { expiresIn });
  return token;
};

export const registerControllers = async (req, res, next) => {
  const jwtKey = process.env.JWT_SECRET; // Use environment variable for secret key
  const expiresIn = "2h";

  try {
    const { name, email, password, UserType, city, site_id } = req.body;

    if (!name || !email || !password || !UserType) {
      return res.json({
        success: false,
        message: "Please enter All Fields",
      });
    }

    // if (UserType === "user" && (!city || !site_id)) {
    //   return res.json({
    //     success: false,
    //     message: "Please enter All Fields",
    //   });
    // }

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

    newUser.password = undefined; // Remove password from user object

    // const token = generateToken(newUser, jwtKey, expiresIn);

    const generateToken = Jwt.sign({ id: newUser._id }, jwtKey);

    await sendVerificationEmail(
      {
        name,
        email,
        UserType,
        // ...(UserType === "user" ? { city, site_id } : {}),
      },
      generateToken
    );

    return res.json({
      success: true,
      message:
        "Your account has been created successfully. You will be able to login after your account is approved by the admin.",
      // user: newUser,
      dashboard: newUser.UserType,
      // token,
    });
  } catch (err) {
    return res.json({
      success: false,
      message: err.message,
    });
  }
};

export const loginControllers = async (req, res, next) => {
  const jwtKey = process.env.JWT_SECRET; // Use environment variable for secret key
  const expiresIn = "2h";

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

    user.password = undefined; // Remove password from user object

    const token = generateToken(user, jwtKey, expiresIn); // Generate token using a separate function

    if (user.UserType === "admin") {
      return res.json({
        success: true,
        message: `Welcome back, ${user.name}`,
        user,
        dashboard: "admin", // render admin dashboard
        token,
      });
    } else {
      return res.json({
        success: true,
        message: `Welcome back, ${user.name}`,
        user,
        dashboard: "user",
        token, // render user dashboard
      });
    }
  } catch (err) {
    console.error(err); // Log error for debugging purposes
    return res.json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const setAvatarController = async (req, res, next) => {
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

export const allUsers = async (req, res, next) => {
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

export const verifyUser = async (req, res, next) => {
  const token = req.get("x-access-token") || req.get("Authorization");

  if (!token) {
    return res.json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    const decoded = Jwt.verify(token.slice(7), process.env.JWT_SECRET);
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

export const verifyEmail = async (req, res) => {
  const jwtKey = process.env.JWT_SECRET; // Use environment variable for secret key
  const expiresIn = "2h";

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
      decodedToken = Jwt.verify(emailToken, jwtKey);
    } catch (error) {}

    if (!decodedToken) {
      return res.json({
        success: false,
        message: "Invalid Token",
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

    // const token = generateToken(user, jwtKey, expiresIn);

    return res.json({
      success: true,
      message: "User approved successfully",
      // user,
      dashboard: user.UserType,
      // token,
    });
  } catch (err) {
    return res.json({
      success: false,
      message: err.message,
    });
  }
};
