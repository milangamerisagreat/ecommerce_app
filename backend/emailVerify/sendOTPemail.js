import dotenv from "dotenv";

dotenv.config();

export const sendOTPemail = async (otp, email) => {
  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": process.env.BREVO_MAIL,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: "Milan Ecommerce",
          email: process.env.BREVO_SENDER_EMAIL,
        },
        to: [
          {
            email,
          },
        ],
        subject: "Password Reset OTP",
        htmlContent: `
          <p>Your OTP for password reset is: <b>${otp}</b>.</p>
          <p>It is valid for 10 minutes.</p>
        `,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Brevo email error:", data);
      return;
    }

    console.log("OTP email sent:", data.messageId);
  } catch (error) {
    console.error("Error sending OTP email:", error);
  }
};