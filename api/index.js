/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import express from "express";
import dotenv from "dotenv";
import cors from "cors"; // Import cors
import db from "./database/configdb.js";
import User from "./model/User.js";
import userRoutes from "./routes/user.route.js";
import protectedRoutes from "./routes/protected.route.js";

dotenv.config();
db.connect();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS with specific configuration
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

app.use(express.json());

app.use("/users", userRoutes);
app.get("/", (req, res) => {
  res.send(`{message: "Hello from the API!"}`);
});

app.use("/protected", protectedRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
