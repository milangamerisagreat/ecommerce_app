import dotenv from "dotenv";

dotenv.config();

export const sendVerificationEmail = async (token, email) => {
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
        subject: "Email Verification",
        htmlContent: `
          <p>Please verify your email by clicking the following link:</p>
          <p>
            <a href="${process.env.FRONTEND_URL}/verify-email/${token}">
              Verify Email
            </a>
          </p>
        `,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Brevo email error:", data);
      return;
    }

    console.log("Verification email sent:", data.messageId);
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};