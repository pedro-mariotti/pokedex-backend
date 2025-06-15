import { login, register } from '../controller/user.controller.js';

/**
 * Handler serverless para as rotas de autenticação de usuário (registro e login).
 * Esta função espera ser invocada por um API Gateway (como AWS API Gateway)
 * com proxy de integração Lambda (ou equivalente).
 *
 * O API Gateway deve ser configurado para as seguintes rotas (ou equivalentes),
 * todas apontando para esta função:
 * - POST /api/users/register
 * - POST /api/users/login
 *
 * O corpo da requisição (event.body) conterá os dados para registro ou login.
 */
export const handler = async (event) => {
    // Extrai informações relevantes do evento do API Gateway
    const httpMethod = event.httpMethod; // e.g., "POST"
    const path = event.path; // e.g., "/api/users/register" ou "/api/users/login"
    // pathParameters não são esperados para estas rotas
    // queryStringParameters não são tipicamente usados para POST de login/registro

    let body = {};
    if (event.body) {
        try {
            body = JSON.parse(event.body);
        } catch (parseError) {
            console.error("Error parsing request body:", parseError);
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Invalid JSON body" }),
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'https://pokeapi-pokedex-4byk.vercel.app/',
                 },
            };
        }
    } else {
        // Corpo é necessário para registro e login
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Request body is missing" }),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'https://pokeapi-pokedex-4byk.vercel.app/',
            },
        };
    }

    const mockReq = {
        // params: {}, // Não há parâmetros de rota
        // query: {},
        body: body,
        headers: event.headers,
    };

    let responsePayload;
    let statusCode = 200;

    const mockRes = {
        status: (code) => {
            statusCode = code;
            return mockRes;
        },
        json: (data) => {
            responsePayload = data;
        },
        send: (data) => { // Para compatibilidade, embora json seja mais comum aqui
            responsePayload = data;
        },
    };

    try {
        if (httpMethod === 'POST' && (path === '/api/users/register' || path.endsWith('/register'))) {
            await register(mockReq, mockRes);
        } else if (httpMethod === 'POST' && (path === '/api/users/login' || path.endsWith('/login'))) {
            await login(mockReq, mockRes);
        } else {
            statusCode = 404;
            responsePayload = { error: `Route not found or method not allowed for ${httpMethod} ${path}` };
        }
    } catch (error) {
        console.error(`Error in user.handler for ${httpMethod} ${path}:`, error);
        statusCode = error.statusCode || 500;
        responsePayload = { error: 'Internal Server Error', message: error.message };
        if (error.isHttpError && error.body) { // Para erros já formatados
             responsePayload = error.body;
        }
    }

    return {
        statusCode: statusCode,
        body: JSON.stringify(responsePayload),
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': 'https://pokeapi-pokedex-4byk.vercel.app/',
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent',
            'Access-Control-Allow-Methods': 'POST,OPTIONS', // Métodos que esta função suporta
        },
    };
};
