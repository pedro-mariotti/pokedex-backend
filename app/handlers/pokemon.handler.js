import {
    getPokemonList,
    getPokemonDetails,
    getPokemonSpeciesDetails,
    getPokemonEvolution,
} from '../controller/pokemon.controller.js';

/**
 * Handler serverless para todas as rotas relacionadas a Pokémon.
 * Esta função espera ser invocada por um API Gateway (como AWS API Gateway)
 * com proxy de integração Lambda (ou equivalente).
 *
 * O API Gateway deve ser configurado para as seguintes rotas (ou equivalentes),
 * todas apontando para esta função (ex: usando um path greedy como /api/pokemon*):
 * - GET /api/pokemon
 * - GET /api/pokemon/{nameOrId}
 * - GET /api/pokemon/{nameOrId}/species
 * - GET /api/pokemon/{nameOrId}/evolution
 *
 * O API Gateway é responsável por extrair o parâmetro do caminho (nameOrId)
 * e passá-lo no objeto `event.pathParameters`.
 */

const commonHeaders = {
    'Content-Type': 'application/json',
};
export const handler = async (event) => {
    const httpMethod = event.httpMethod;
    const path = event.path;
    const pathParameters = event.pathParameters || {};
    const queryStringParameters = event.queryStringParameters || {};
    // Não esperamos corpo para requisições GET de Pokémon

    const mockReq = {
        params: pathParameters,
        query: queryStringParameters,
        headers: event.headers,
        body: {}, // Inicializa body como objeto vazio
    };

    // Tenta parsear o body apenas se ele existir
    if (event.body) {
        try {
            mockReq.body = JSON.parse(event.body);
        } catch (parseError) {
            console.warn("Warning: Request body received and failed to parse for a GET request:", parseError);
        }
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
        if (httpMethod === 'GET') {
            // GET /api/pokemon/{nameOrId}/species
            if (pathParameters.nameOrId && path.endsWith('/species')) {
                await getPokemonSpeciesDetails(mockReq, mockRes);
            }
            // GET /api/pokemon/{nameOrId}/evolution
            else if (pathParameters.nameOrId && path.endsWith('/evolution')) {
                await getPokemonEvolution(mockReq, mockRes);
            }
            // GET /api/pokemon/{nameOrId}
            else if (pathParameters.nameOrId) {
                await getPokemonDetails(mockReq, mockRes);
            }
            // GET /api/pokemon
            else if (path === '/api/pokemon' || path === '/api/pokemon/') {
                await getPokemonList(mockReq, mockRes);
            }
            // Nenhuma rota GET correspondente
            else {
                statusCode = 404;
                responsePayload = { error: `Route not found for GET ${path}` };
            }
        } else {
            // Método HTTP não suportado para /api/pokemon/*
            statusCode = 405; // Method Not Allowed
            responsePayload = { error: `Method ${httpMethod} not allowed for ${path}` };
        }
    } catch (error) {
        console.error(`Error in pokemon.handler for ${httpMethod} ${path}:`, error);
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
