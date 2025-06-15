import express from "express";
// A importação do controller pode não ser mais necessária aqui, pois o pokeTeam.handler.js
// agora é responsável por chamar os métodos do controller.
// import {
//   createPokeTeam,
//   getPokeTeamsByUser,
//   getPokeTeamById,
//   updatePokeTeam,
//   deletePokeTeam,
// } from "../controller/pokeTeam.controller.js";


const router = express.Router();

// Rota para criar uma nova equipe Pokémon
// POST /api/poketeams
// A rota POST /api/poketeams agora é gerenciada por:
// 1. Configuração do API Gateway que aponta para a função serverless pokeTeam.handler.js
// 2. O arquivo api/handlers/pokeTeam.handler.js que processa o evento e chama
//    pokeTeamController.createPokeTeam.

// Rota para buscar todas as equipes de um usuário específico
// GET /api/poketeams/user/:userId
// A rota GET /api/poketeams/user/:userId agora é gerenciada pelo pokeTeam.handler.js
// que chama pokeTeamController.getPokeTeamsByUser.

// Rota para buscar detalhes de uma equipe Pokémon específica (inclui nome, pokémons, ID do criador)
// GET /api/poketeams/:teamId
// A rota GET /api/poketeams/:teamId agora é gerenciada pelo pokeTeam.handler.js
// que chama pokeTeamController.getPokeTeamById.

// Rota para editar uma equipe Pokémon
// PUT /api/poketeams/:teamId
// A rota PUT /api/poketeams/:teamId agora é gerenciada pelo pokeTeam.handler.js
// que chama pokeTeamController.updatePokeTeam.

// Rota para apagar uma equipe Pokémon
// DELETE /api/poketeams/:teamId
// A rota DELETE /api/poketeams/:teamId agora é gerenciada pelo pokeTeam.handler.js
// que chama pokeTeamController.deletePokeTeam.

export default router;
