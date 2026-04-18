import nodemailer from "nodemailer";
import crypto from "crypto";
import {User} from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config();


export const sendOTPemail = async (otp, email) => {
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
    subject: "password reset OTP",
   html : `<p>Your OTP for password reset is: <b>${otp}</b>. It is valid for 10 minutes.</p>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("OTP email sent:", info.response);
    }
  });
};
