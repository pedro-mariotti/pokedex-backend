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

const handlerResponseHeaders = {
    'Content-Type': 'application/json',
};
export const handler = async (event) => {
    // Extrai informações relevantes do evento do API Gateway
    const httpMethod = event.httpMethod; // e.g., "POST"
    const path = event.path; // e.g., "/api/users/register" ou "/api/users/login"
    // pathParameters não são esperados para estas rotas
    // queryStringParameters não são tipicamente usados para POST de login/registro
    console.log(`[user.handler] Evento recebido: ${httpMethod} ${path}`);

    let body = {};
    if (event.body) {
        try {
            body = JSON.parse(event.body);
        } catch (parseError) {
            console.error("Error parsing request body:", parseError);
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Invalid JSON body" }),
                headers: handlerResponseHeaders,
            };
        }
    } else {
        // Corpo é necessário para registro e login
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Request body is missing" }),
            headers: handlerResponseHeaders,
        };
    }

    const mockReq = {
        // params: {}, // Não há parâmetros de rota
        // query: {},
        body: body,
        headers: event.headers,
    };
    console.log(`[user.handler] Corpo do mockReq para o controller:`, mockReq.body);

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
            console.log(`[user.handler] Após controller de registro. statusCode: ${statusCode}, responsePayload:`, responsePayload);
        } else if (httpMethod === 'POST' && (path === '/api/users/login' || path.endsWith('/login'))) {
            await login(mockReq, mockRes);
            console.log(`[user.handler] Após controller de login. statusCode: ${statusCode}, responsePayload:`, JSON.stringify(responsePayload));
        } else {
            statusCode = 404;
            responsePayload = { error: `Route not found or method not allowed for ${httpMethod} ${path}` };
            console.log(`[user.handler] Rota não encontrada. statusCode: ${statusCode}, responsePayload:`, responsePayload);
        }
    } catch (error) {
        console.error(`[user.handler] Erro para ${httpMethod} ${path}:`, error.message, error.stack);
        statusCode = error.statusCode || 500;
        responsePayload = { error: 'Internal Server Error', message: error.message };
        if (error.isHttpError && error.body) { // Para erros já formatados
             responsePayload = error.body;
        }
    }

    return {
        statusCode: statusCode,
        body: JSON.stringify(responsePayload),
        headers: handlerResponseHeaders,
    };
};
