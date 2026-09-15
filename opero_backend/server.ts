import "dotenv/config";
import app from "./src/app.js";

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Opero backend running on port ${PORT}`);
});
