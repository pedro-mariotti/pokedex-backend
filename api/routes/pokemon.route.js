import express from 'express';
const router = express.Router();
// A importação do controller pode não ser mais necessária aqui, pois o pokemon.handler.js
// agora é responsável por chamar os métodos do controller.

// Rota para listar Pokémon (com paginação opcional via query params limit e offset)
// A rota GET /api/pokemon agora é gerenciada por:
// 1. Configuração do API Gateway que aponta para a função serverless pokemon.handler.js
// 2. O arquivo api/handlers/pokemon.handler.js que processa o evento e chama
//    pokemonController.getPokemonList.

// Rota para buscar detalhes de um Pokémon específico pelo nome ou ID
// A rota GET /api/pokemon/:nameOrId agora é gerenciada pelo pokemon.handler.js
// que chama pokemonController.getPokemonDetails.

// A rota GET /api/pokemon/:nameOrId/species agora é gerenciada pelo pokemon.handler.js
// que chama pokemonController.getPokemonSpeciesDetails.

// A rota GET /api/pokemon/:nameOrId/evolution agora é gerenciada pelo pokemon.handler.js
// que chama pokemonController.getPokemonEvolution.

export default router;