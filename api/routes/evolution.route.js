import express from 'express';
const router = express.Router();
import * as evolutionController from '../controller/evolution.controller.js';

// Rota para buscar uma cadeia de evolução pelo seu ID numérico
router.get('/:chainId', evolutionController.getEvolutionChainById); // Corresponde a /api/evolution-chain/:chainId

// Rota para buscar a cadeia de evolução de um Pokémon específico (busca a espécie primeiro)
export default router;