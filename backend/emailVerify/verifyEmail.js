import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendVerificationEmail = async (token, email) => {
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
    text: `Please verify your email by clicking the following link: ${process.env.FRONTEND_URL}/verify-email/${token}`,
  };

  const info = await transporter.sendMail(mailOptions);

  console.log("Email sent:", info.response);

  return info;
};