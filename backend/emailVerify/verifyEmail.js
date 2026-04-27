import nodemailer from "nodemailer";
import crypto from "crypto";
import {User} from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config();


export const sendVerificationEmail = (token, email) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: "Email Verification",
    text: `Please verify your email by clicking the following link: http://localhost:5173/verify-email/${token}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};
