import express from "express";
import { handler as pokeTeamHandler } from '../handlers/pokeTeam.handler.js';

const router = express.Router();

// Função auxiliar
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

const POKETEAM_BASE_PATH = '/api/poketeams';

// POST /api/poketeams
router.post('/', (req, res, next) => {
    callApiHandler(req, res, next, pokeTeamHandler, POKETEAM_BASE_PATH);
});

// GET /api/poketeams/search
router.get('/search', (req, res, next) => {
    callApiHandler(req, res, next, pokeTeamHandler, POKETEAM_BASE_PATH);
});

// GET /api/poketeams/user/:userId
router.get('/user/:userId', (req, res, next) => {
    callApiHandler(req, res, next, pokeTeamHandler, POKETEAM_BASE_PATH);
});

// GET /api/poketeams/:teamId
router.get('/:teamId', (req, res, next) => {
    callApiHandler(req, res, next, pokeTeamHandler, POKETEAM_BASE_PATH);
});

// PUT /api/poketeams/:teamId
router.put('/:teamId', (req, res, next) => {
    callApiHandler(req, res, next, pokeTeamHandler, POKETEAM_BASE_PATH);
});

// DELETE /api/poketeams/:teamId
router.delete('/:teamId', (req, res, next) => {
    callApiHandler(req, res, next, pokeTeamHandler, POKETEAM_BASE_PATH);
});

export default router;
