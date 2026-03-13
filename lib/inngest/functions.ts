import { inngest } from "./client";
import { sendWelcomeEmail } from "../nodemailer";

export const sendSignUpEmail = inngest.createFunction(
  { id: "sign-up-email" },
  { event: "app/user.created" },
  async ({ event }) => {

    const { email, name } = event.data;

    return await sendWelcomeEmail({
      email,
      name,
      intro: "Thank you",
    });
  }
);