import { Router } from "express";
import { sendOtp, verifyOtp } from "../controllers/authController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import prisma from "../config/database.js";

const router = Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

// Example of a protected route: only works if the request has a valid token.
router.get("/me", authenticate, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  res.json({ user });
});

export default router;
