import express from 'express';
const router = express.Router();
import * as itemController from '../controller/item.controller.js';

// Rota para buscar detalhes de um item pelo nome ou ID
router.get('/:nameOrId', itemController.getItemDetails); // Corresponde a /api/items/:nameOrId

export default router;