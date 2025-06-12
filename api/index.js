/* eslint-disable no-undef */
import express from "express";
import dotenv from "dotenv";
import cors from "cors"; // Import cors
import db from "./database/configdb.js";
import userRoutes from "./routes/user.route.js";
import pokeTeamRoutes from "./routes/pokeTeam.route.js";
// Importar as novas rotas relacionadas à PokeAPI
import pokemonApiRoutes from "./routes/pokemon.route.js"; // Para /api/pokemon, /api/pokemon/:id, etc.
import typeApiRoutes from "./routes/type.route.js";       // Para /api/types
import evolutionApiRoutes from "./routes/evolution.route.js"; // Para /api/evolution-chain
import itemApiRoutes from "./routes/item.route.js";         // Para /api/items

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
// Registrar as novas rotas da PokeAPI
app.use("/api/pokemon", pokemonApiRoutes);
app.use("/api/types", typeApiRoutes);
app.use("/api/evolution-chain", evolutionApiRoutes);
app.use("/api/items", itemApiRoutes);


app.get("/", (req, res) => {
  res.json({ message: "Hello from the API!" });
});

// Middleware de tratamento de erros centralizado
// Deve ser o último middleware adicionado
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack || err); // Log do stack trace para melhor debugging
  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }) // Opcional: envia stack trace em desenvolvimento
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
