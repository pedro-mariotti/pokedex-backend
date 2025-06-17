import { getTypeDetails } from '../controller/type.controller.js';

/**
 * Handler serverless para a rota de detalhes de tipos de Pokémon.
 * Esta função espera ser invocada por um API Gateway (como AWS API Gateway)
 * com proxy de integração Lambda (ou equivalente).
 *
 * O API Gateway deve ser configurado para a seguinte rota (ou equivalente),
 * apontando para esta função:
 * - GET /api/types/{nameOrId}
 *
 * O API Gateway é responsável por extrair o parâmetro do caminho (nameOrId)
 * e passá-lo no objeto `event.pathParameters`.
 */

const TYPE_ALLOWED_METHODS = 'GET,OPTIONS';
const commonHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'https://pokeapi-pokedex-4byk.vercel.app/',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent',
    'Access-Control-Allow-Methods': TYPE_ALLOWED_METHODS,
};
export const handler = async (event) => {
    // Extrai informações relevantes do evento do API Gateway
    const httpMethod = event.httpMethod; // e.g., "GET"
    const path = event.path; // e.g., "/api/types/fire"
    const pathParameters = event.pathParameters || {}; // e.g., { nameOrId: "fire" }
    const queryStringParameters = event.queryStringParameters || {};
    // Não esperamos corpo para uma requisição GET de tipo

    // Simulação dos objetos 'req' e 'res' do Express para manter a compatibilidade 
    // com o controlador existente.
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
        // Lógica de roteamento interna baseada no método HTTP e nos parâmetros de caminho
        if (httpMethod === 'GET' && pathParameters.nameOrId && path.startsWith('/api/types/')) {
            await getTypeDetails(mockReq, mockRes);
        } else {
            statusCode = 404;
            responsePayload = { error: `Route not found or method not allowed for ${httpMethod} ${path}` };
        }
    } catch (error) {
        console.error(`Error in type.handler for ${httpMethod} ${path}:`, error);
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