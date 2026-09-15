import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Opero Backend API is running" });
});

app.use("/api/auth", authRoutes);

export default app;
