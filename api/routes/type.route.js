import express from 'express';
const router = express.Router();
import * as typeController from '../controller/type.controller.js';

// Rota para buscar detalhes de um tipo de Pokémon pelo nome ou ID
router.get('/:nameOrId', typeController.getTypeDetails); // Corresponde a /api/types/:nameOrId

export default router;