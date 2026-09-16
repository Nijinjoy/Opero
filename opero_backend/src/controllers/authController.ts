import { Request, Response } from "express";
import * as authService from "../services/authService.js";

// Step 1: user enters their phone number, we ask Twilio to text them a code.
export async function sendOtp(req: Request, res: Response) {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ message: "Phone number is required" });
  }

  try {
    await authService.sendOtp(phone);
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
    const result = await authService.verifyOtp(phone, code);

    if (!result) {
      return res.status(400).json({ message: "Incorrect or expired code" });
    }

    res.json({ message: "Login successful", token: result.token, user: result.user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not verify OTP" });
  }
}
