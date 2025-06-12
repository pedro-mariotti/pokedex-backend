import axios from 'axios';
const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';

/**
 * Fetches data from a given PokeAPI endpoint.
 * @param {string} endpoint - The PokeAPI endpoint (e.g., 'pokemon/pikachu') or a full URL.
 * @returns {Promise<Object>} The data from PokeAPI.
 * @throws {Error} If the API call fails.
 */
export const fetchDataFromPokeApi = async (endpoint) => {
    try {
        const url = endpoint.startsWith('http') ? endpoint : `${POKEAPI_BASE_URL}/${endpoint}`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(`Error fetching from PokeAPI endpoint '${endpoint}':`, error.response?.data || error.message);
        const status = error.response?.status || 500;
        const message = error.response?.data?.detail || error.response?.data || error.message || 'Failed to fetch data from PokeAPI';
        // Criar um objeto de erro padrão para melhor rastreamento
        const err = new Error(message);
        err.status = status;
        err.source = 'pokeapi';
        throw err;
    }
};