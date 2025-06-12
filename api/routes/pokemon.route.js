import express from 'express';
const router = express.Router();
import * as pokemonController from '../controller/pokemon.controller.js';

// Rota para listar Pokémon (com paginação opcional via query params limit e offset)
router.get('/', pokemonController.getPokemonList); // Corresponde a /api/pokemon

// Rota para buscar detalhes de um Pokémon específico pelo nome ou ID
router.get('/:nameOrId', pokemonController.getPokemonDetails); // Corresponde a /api/pokemon/:nameOrId

router.get('/:nameOrId/species', pokemonController.getPokemonSpeciesDetails); // Corresponde a /api/pokemon/:nameOrId/species

router.get('/:nameOrId/evolution', pokemonController.getPokemonEvolution); // Corresponde a /api/pokemon/:nameOrId/evolution

export default router;