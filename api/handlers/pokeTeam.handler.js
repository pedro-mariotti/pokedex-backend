import {
  createPokeTeam,
  getPokeTeamsByUser,
  getPokeTeamById,
  updatePokeTeam,
  deletePokeTeam,
} from '../controller/pokeTeam.controller.js';

/**
 * Handler serverless para todas as rotas relacionadas a PokeTeams.
 * Esta função espera ser invocada por um API Gateway (como AWS API Gateway)
 * com proxy de integração Lambda (ou equivalente).
 *
 * O API Gateway deve ser configurado para as seguintes rotas (ou equivalentes),
 * todas apontando para esta função:
 * - POST /api/poketeams
 * - GET /api/poketeams/user/{userId}
 * - GET /api/poketeams/{teamId}
 * - PUT /api/poketeams/{teamId}
 * - DELETE /api/poketeams/{teamId}
 *
 * O API Gateway é responsável por extrair os parâmetros do caminho (userId, teamId)
 * e passá-los no objeto `event.pathParameters`.
 */

const commonHeaders = {
    'Content-Type': 'application/json',
};

export const handler = async (event) => {
    // Extrai informações relevantes do evento do API Gateway
    const httpMethod = event.httpMethod; // e.g., "GET", "POST"
    const path = event.path; // e.g., "/api/poketeams", "/api/poketeams/user/123", "/api/poketeams/abc"
    const pathParameters = event.pathParameters || {}; // e.g., { userId: "123" } ou { teamId: "abc" }
    const queryStringParameters = event.queryStringParameters || {};
    let body = {};
    if (event.body) {
        try {
            body = JSON.parse(event.body);
        } catch (parseError) {
            console.error("Error parsing request body:", parseError);
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Invalid JSON body" }),
                headers: commonHeaders,
            };
        }
    }

    // Simulação dos objetos 'req' e 'res' do Express para manter a compatibilidade
    // com os controladores existentes.
    const mockReq = {
        params: pathParameters,
        query: queryStringParameters,
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
        send: (data) => {
            responsePayload = data;
        },
    };

    try {
        // Lógica de roteamento interna baseada no método HTTP e nos parâmetros de caminho
        if (httpMethod === 'POST' && (path === '/api/poketeams' || path === '/api/poketeams/')) {
            await createPokeTeam(mockReq, mockRes);
        } else if (httpMethod === 'GET' && path.startsWith('/api/poketeams/user/') && pathParameters.userId) {
            await getPokeTeamsByUser(mockReq, mockRes);
        } else if (httpMethod === 'PUT' && pathParameters.teamId && path.startsWith('/api/poketeams/') && !path.includes('/user/')) {
            await updatePokeTeam(mockReq, mockRes);
        } else if (httpMethod === 'DELETE' && pathParameters.teamId && path.startsWith('/api/poketeams/') && !path.includes('/user/')) {
            await deletePokeTeam(mockReq, mockRes);
        } else if (httpMethod === 'GET' && pathParameters.teamId && path.startsWith('/api/poketeams/') && !path.includes('/user/')) {
            await getPokeTeamById(mockReq, mockRes);
        } else {
            statusCode = 404;
            responsePayload = { error: `Route not found or method not allowed for ${httpMethod} ${path}` };
        }
    } catch (error) {
        console.error(`Error in pokeTeam.handler for ${httpMethod} ${path}:`, error);
        statusCode = error.statusCode || 500;
        responsePayload = { error: 'Internal Server Error', message: error.message };
        if (error.isHttpError && error.body) { // Para erros já formatados
             responsePayload = error.body;
        }
    }

    return {
        statusCode: statusCode,
        body: JSON.stringify(responsePayload),
        headers: commonHeaders,
    };
};
