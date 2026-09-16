import jwt from "jsonwebtoken";
import prisma from "../config/database.js";
import { twilioClient, verifyServiceSid } from "../config/twilio.js";

// Step 1: ask Twilio to text a verification code to the given phone number.
export async function sendOtp(phone: string) {
  await twilioClient.verify.v2
    .services(verifyServiceSid)
    .verifications.create({ to: phone, channel: "sms" });
}

// Step 2: ask Twilio if the code the user entered is correct, then log them in.
export async function verifyOtp(phone: string, code: string) {
  const result = await twilioClient.verify.v2
    .services(verifyServiceSid)
    .verificationChecks.create({ to: phone, code });

  if (result.status !== "approved") {
    return null;
  }

  // Code is correct: log the user in.
  // If this is their first time, create a new account for them.
  let user = await prisma.user.findUnique({ where: { phone } });
  if (!user) {
    user = await prisma.user.create({ data: { phone } });
  }

  // Give the user a token they can use for future requests instead of logging in again.
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, {
    expiresIn: "7d"
  });

  return { token, user };
}
