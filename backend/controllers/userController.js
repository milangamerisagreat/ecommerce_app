import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as verifyemail from "../emailVerify/verifyEmail.js";
import Session from "../models/sessionModel.js";
import { send } from "process";
import { sendOTPemail } from "../emailVerify/sendOTPemail.js";

export const register = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("REGISTER SECRET:", process.env.JWT_SECRET);

    const { firstName, lastName, email, password } = req.body || {};

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });

    verifyemail.sendVerificationEmail(token, email);

    newUser.tokens = token;
    await newUser.save();

    return res.status(201).json({
      success: true,
      user: newUser,
      token,
      message: "User registered successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error registering user",
      error: error.message,
    });
  }
};

export const verify = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1].trim();

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.tokens = null;
    user.isVerified = true;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error verifying token",
      error: error.message,
    });
  }
};

export const reVerify = async (req, res) => {
  try {
    const { email } = req.body || {};

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });

    verifyemail.sendVerificationEmail(token, email);

    user.tokens = token;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Verification email resent successfully",
      token: user.tokens,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error sending verification email",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password,
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    if (existingUser.isVerified === false) {
      return res.status(401).json({
        success: false,
        message: "Email not verified",
      });
    }

    const accessToken = jwt.sign(
      { id: existingUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "15min" },
    );

    const refreshToken = jwt.sign(
      { id: existingUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    existingUser.isLoggedin = true;
    existingUser.tokens = accessToken;
    await existingUser.save();

    await Session.deleteMany({ userId: existingUser._id });
    await Session.create({ userId: existingUser._id });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error logging in",
      error: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    const userId = req.user.id;
    await Session.deleteMany({ userId: userId });

    const user = await User.findByIdAndUpdate(userId, {
      isLoggedin: false,
      tokens: null,
    });
    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error logging out",
      error: error.message,
    });
  }
};

export const forgotPassword = async (req, res) => {
  console.log("EMAIL:", req.body.email);
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    };

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = Date.now() + 10 * 60 * 1000; //10 minutes
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    await sendOTPemail(otp, email);
    return res.status(200).json({
      success: true,
      message: "OTP sent to email",
    });
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error processing forgot password request",
      error: error.message,
    });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { otp } = req.body;
    const email = req.params.email;

    const user = await User.findOne({ email }); // 👈 yaha define

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("DB OTP:", user.otp);
    console.log("DB EXPIRY:", user.otpExpiry);

    if (user.otp == null || user.otpExpiry == null) {
      return res.status(400).json({
        success: false,
        message: "OTP expired or not found",
      });
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    if (otp.toString() !== user.otp.toString()) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error verifying OTP",
      error: error.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const {newpassword, conmfirmpassword} = req.body;
    const {email} = req.params
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if(!newpassword || !conmfirmpassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password are required",
      });
    }

    if (newpassword !== conmfirmpassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    const hashedPassword = await bcrypt.hash(newpassword, 10);
    user.password = hashedPassword;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error resetting password",
      error: error.message,
    });
  }
};

export const getUser = async (req, res) => {
  try {
   const user = await User.findById(req.user._id).select("-password");
    return res.status(200).json({
      success: true,
      user,
    });

    
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching user details",
      error: error.message,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const {userId} = req.params;
   const user = await User.findById(userId).select("-password -tokens -otp -otpExpiry");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching user details",
      error: error.message,
    });
  }
};