import { fetchDataFromPokeApi } from '../services/pokeapi.service.js';

export const getEvolutionChainById = async (req, res, next) => {
    const { chainId } = req.params;
    try {
        const evolutionData = await fetchDataFromPokeApi(`evolution-chain/${chainId}`);

        // Função recursiva para tratar a estrutura da cadeia de evolução
        const parseEvolutionChain = (chain) => {
            if (!chain) return null;
            const speciesName = chain.species.name;
            // O frontend pode usar este nome para buscar detalhes completos do Pokémon via /api/pokemon/:name
            const evolutionDetails = chain.evolution_details.map(detail => ({
                item: detail.item ? detail.item.name : null, // O frontend pode usar /api/items/:name
                trigger: detail.trigger.name,
                min_level: detail.min_level,
            }));

            return {
                species_name: speciesName,
                evolves_to: chain.evolves_to.map(parseEvolutionChain),
                evolution_details: evolutionDetails.length > 0 ? evolutionDetails : undefined,
            };
        };

        const treatedData = parseEvolutionChain(evolutionData.chain);
        res.status(200).json(treatedData);
    } catch (error) {
        // Passa o erro para o middleware de tratamento de erros centralizado
        error.message = error.message || `Error fetching evolution chain ${chainId}`;
        next(error);
    }
};