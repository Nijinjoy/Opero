import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../config/database.js";
import { twilioClient, verifyServiceSid } from "../config/twilio.js";

// Step 1: user enters their phone number, we ask Twilio to text them a code.
export async function sendOtp(req: Request, res: Response) {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ message: "Phone number is required" });
  }

  try {
    await twilioClient.verify.v2
      .services(verifyServiceSid)
      .verifications.create({ to: phone, channel: "sms" });

    res.json({ message: "OTP sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not send OTP" });
  }
}

// Step 2: user enters the code they received, we ask Twilio if it's correct.
export async function verifyOtp(req: Request, res: Response) {
  const { phone, code } = req.body;

  if (!phone || !code) {
    return res.status(400).json({ message: "Phone number and code are required" });
  }

  try {
    const result = await twilioClient.verify.v2
      .services(verifyServiceSid)
      .verificationChecks.create({ to: phone, code });

    if (result.status !== "approved") {
      return res.status(400).json({ message: "Incorrect or expired code" });
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

    res.json({ message: "Login successful", token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not verify OTP" });
  }
}
