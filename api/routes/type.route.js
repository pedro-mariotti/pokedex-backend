import express from 'express';
const router = express.Router();
// A importação do controller pode não ser mais necessária aqui se o handler está cuidando da lógica.

// Rota para buscar detalhes de um tipo de Pokémon pelo nome ou ID
// A rota GET /api/types/:nameOrId agora é gerenciada por:
// 1. Configuração do API Gateway que aponta para a função serverless type.handler.js
// 2. O arquivo api/handlers/type.handler.js que processa o evento e chama
//    a função apropriada do type.controller.js (getTypeDetails).

export default router;