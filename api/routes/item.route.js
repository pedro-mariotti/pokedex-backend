import express from 'express';
const router = express.Router();
// A importação do controller pode não ser mais necessária aqui se o handler está cuidando da lógica.

// Rota para buscar detalhes de um item pelo nome ou ID
// A rota GET /api/items/:nameOrId agora é gerenciada por:
// 1. Configuração do API Gateway que aponta para a função serverless item.handler.js
// 2. O arquivo api/handlers/item.handler.js que processa o evento e chama
//    a função apropriada do item.controller.js (getItemDetails).
// router.get('/:nameOrId', itemController.getItemDetails); // Linha original comentada

export default router;