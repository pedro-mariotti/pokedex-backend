/* eslint-disable no-undef */
import express from "express";
import dotenv from "dotenv";
import cors from "cors"; // Import cors
import db from "./database/configdb.js";
import userRoutes from "./routes/user.route.js";
import pokeTeamRoutes from "./routes/pokeTeam.route.js";

dotenv.config();
db.connect();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS with specific configuration
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/poketeams", pokeTeamRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Hello from the API!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
