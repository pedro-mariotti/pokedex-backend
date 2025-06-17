import express from "express";
import { handler as userHandler } from '../handlers/user.handler.js';

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

const USER_BASE_PATH = '/api/users';

// POST /api/users/register
router.post('/register', (req, res, next) => {
    callApiHandler(req, res, next, userHandler, USER_BASE_PATH);
});

// POST /api/users/login
router.post('/login', (req, res, next) => {
    callApiHandler(req, res, next, userHandler, USER_BASE_PATH);
});

export default router;