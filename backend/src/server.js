import dns from "dns";
import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import app from "./app.js";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const PORT = ENV.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Startup failed:", err);
    process.exit(1);
  }
};

startServer();
