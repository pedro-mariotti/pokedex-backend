import { fetchDataFromPokeApi } from '../services/pokeapi.service.js';

export const getTypeDetails = async (req, res, next) => {
    const { nameOrId } = req.params;
    try {
        const typeData = await fetchDataFromPokeApi(`type/${nameOrId.toLowerCase()}`);

        const treatedData = {
            id: typeData.id,
            name: typeData.name,
            damage_relations: typeData.damage_relations, // Pode ser extenso
            pokemon: typeData.pokemon.map(pInfo => pInfo.pokemon.name), // Apenas nomes, frontend pode chamar /api/pokemon/:name

        };
        res.status(200).json(treatedData);
    } catch (error) {
        error.message = error.message || `Error fetching type details for ${nameOrId}`;
        next(error);
    }
};