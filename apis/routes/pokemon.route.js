import express from 'express';
import { handler as pokemonHandler } from '../handlers/pokemon.handler.js';

const router = express.Router();

// Função auxiliar para chamar o handler e adaptar a resposta
async function callApiHandler(req, res, next, handlerFunction, expectedBasePath) {
    try {
        const event = {
            httpMethod: req.method,
            path: `${expectedBasePath}${req.path === '/' && Object.keys(req.params).length === 0 ? '' : req.path}`,
            pathParameters: req.params,
            queryStringParameters: req.query,
            headers: req.headers,
            body: req.body && Object.keys(req.body).length > 0 ? JSON.stringify(req.body) : null,
        };
        if (event.path !== expectedBasePath && event.path.endsWith('/')) {
            event.path = event.path.slice(0, -1);
        }
        const result = await handlerFunction(event);
        if (result.headers) {
            res.set(result.headers);
        }
        res.status(result.statusCode).send(result.body);
    } catch (error) {
        next(error);
    }
}

const POKEMON_BASE_PATH = '/api/pokemon';

// GET /api/pokemon (raiz do router)
router.get('/', (req, res, next) => {
    callApiHandler(req, res, next, pokemonHandler, POKEMON_BASE_PATH);
});

// GET /api/pokemon/:nameOrId/species
router.get('/:nameOrId/species', (req, res, next) => {
    callApiHandler(req, res, next, pokemonHandler, POKEMON_BASE_PATH);
});

// GET /api/pokemon/:nameOrId/evolution
router.get('/:nameOrId/evolution', (req, res, next) => {
    callApiHandler(req, res, next, pokemonHandler, POKEMON_BASE_PATH);
});

// GET /api/pokemon/:nameOrId
router.get('/:nameOrId', (req, res, next) => {
    callApiHandler(req, res, next, pokemonHandler, POKEMON_BASE_PATH);
});

export default router;