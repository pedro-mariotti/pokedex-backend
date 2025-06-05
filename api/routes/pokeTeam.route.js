import express from "express";
import {
  createPokeTeam,
  getPokeTeamsByUser,
  getPokeTeamById,
  updatePokeTeam,
  deletePokeTeam,
} from "../controller/pokeTeam.controller.js";

const router = express.Router();

// Rota para criar uma nova equipe Pokémon
// POST /api/poketeams
router.post("/", createPokeTeam);

// Rota para buscar todas as equipes de um usuário específico
// GET /api/poketeams/user/:userId
router.get("/user/:userId", getPokeTeamsByUser);

// Rota para buscar detalhes de uma equipe Pokémon específica (inclui nome, pokémons, ID do criador)
// GET /api/poketeams/:teamId
router.get("/:teamId", getPokeTeamById);

// Rota para editar uma equipe Pokémon
// PUT /api/poketeams/:teamId
router.put("/:teamId", updatePokeTeam);

// Rota para apagar uma equipe Pokémon
// DELETE /api/poketeams/:teamId
router.delete("/:teamId", deletePokeTeam);

export default router;
