import { fetchDataFromPokeApi } from '../services/pokeapi.service.js';
import { getEvolutionChainById as getEvolutionChainByIdFromController } from './evolution.controller.js';

export const getPokemonList = async (req, res, next) => {
    const { limit = 20, offset = 0 } = req.query;
    try {
        const data = await fetchDataFromPokeApi(`pokemon?limit=${limit}&offset=${offset}`);

        const treatedData = {
            count: data.count,
            next: data.next ? `/api/pokemon?limit=${limit}&offset=${parseInt(offset, 10) + parseInt(limit, 10)}` : null,
            previous: data.previous ? `/api/pokemon?limit=${limit}&offset=${Math.max(0, parseInt(offset, 10) - parseInt(limit, 10))}` : null,
            results: data.results.map(p => ({
                name: p.name,
                // O frontend usará o 'name' para chamar /api/pokemon/:name
                // Ou podemos extrair o ID da URL para uso futuro:
                // id: p.url.split('/').filter(Boolean).pop()
            })),
        };
        res.status(200).json(treatedData);
    } catch (error) {
        error.message = error.message || 'Error fetching Pokémon list';
        next(error);
    }
};

export const getPokemonDetails = async (req, res, next) => {
    const { nameOrId } = req.params;
    try {
        const pokemonData = await fetchDataFromPokeApi(`pokemon/${nameOrId.toLowerCase()}`);

        const treatedData = {
            id: pokemonData.id,
            name: pokemonData.name,
            height: pokemonData.height, // em decímetros
            weight: pokemonData.weight, // em hectogramas
            types: pokemonData.types.map(typeInfo => typeInfo.type.name),
            abilities: pokemonData.abilities.map(abilityInfo => abilityInfo.ability.name),
            sprite: pokemonData.sprites?.front_default,
            species_url: `/api/pokemon/${pokemonData.species.name}/species`,
        };
        res.status(200).json(treatedData);
    } catch (error) {
        error.message = error.message || `Error fetching Pokémon details for ${nameOrId}`;
        next(error);
    }
};

export const getPokemonSpeciesDetails = async (req, res, next) => {
    const { nameOrId } = req.params;
    try {
        const speciesData = await fetchDataFromPokeApi(`pokemon-species/${nameOrId.toLowerCase()}`);
        const evolutionChainId = speciesData.evolution_chain.url.split('/').filter(Boolean).pop();
        const treatedData = {
            id: speciesData.id,
            name: speciesData.name,
            generation: speciesData.generation?.name,
            habitat: speciesData.habitat?.name,
            flavor_text_entries: speciesData.flavor_text_entries?.filter(entry => entry.language.name === 'en').slice(0, 3).map(entry => entry.flavor_text.replace(/\n|\f/g, ' ')), // Exemplo: pegar alguns flavor texts em inglês
            evolution_chain_url: `/api/evolution-chain/${evolutionChainId}`,
        };
        res.status(200).json(treatedData);
    } catch (error) {
        error.message = error.message || `Error fetching Pokémon species details for ${nameOrId}`;
        next(error);
    }
};

export const getPokemonEvolution = async (req, res, next) => {
    const { nameOrId } = req.params;
    try {
        const speciesData = await fetchDataFromPokeApi(`pokemon-species/${nameOrId.toLowerCase()}`);
        if (!speciesData.evolution_chain || !speciesData.evolution_chain.url) {
            return res.status(404).json({ message: 'Evolution chain URL not found for this Pokémon species.' });
        }
        const evolutionChainId = speciesData.evolution_chain.url.split('/').filter(Boolean).pop();
        req.params.chainId = evolutionChainId; // Passa o chainId para o controlador de evolução
        return getEvolutionChainByIdFromController(req, res, next); // Chama a função do evolutionController
    } catch (error) {
        error.message = error.message || `Error fetching evolution for Pokémon ${nameOrId}`;
        next(error);
    }
};