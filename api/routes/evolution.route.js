import express from 'express';
const router = express.Router();
// A importação do controller pode não ser mais necessária aqui se o handler está cuidando da lógica.

// A rota GET /api/evolution-chain/:chainId agora é gerenciada por:
// 1. Configuração do API Gateway que aponta para a função serverless evolution.handler.js
// 2. O arquivo api/handlers/evolution.handler.js que processa o evento e chama
//    a função apropriada do evolution.controller.js (getEvolutionChainById).
// router.get('/:chainId', evolutionController.getEvolutionChainById); // Linha original comentada

// Rota para buscar a cadeia de evolução de um Pokémon específico (busca a espécie primeiro)
// Esta funcionalidade, se ainda for necessária, foi movida para ser tratada dentro do
// pokemon.handler.js, que chama o evolution.controller.js quando o path é /api/pokemon/:nameOrId/evolution

export default router;