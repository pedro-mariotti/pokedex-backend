import { fetchDataFromPokeApi } from '../services/pokeapi.service.js';

export const getItemDetails = async (req, res, next) => {
    const { nameOrId } = req.params;
    try {
        const itemData = await fetchDataFromPokeApi(`item/${nameOrId.toLowerCase()}`);

        const treatedData = {
            id: itemData.id,
            name: itemData.name,
            cost: itemData.cost,
            sprite: itemData.sprites?.default,
            effect_entries: itemData.effect_entries?.filter(e => e.language.name === 'en').map(e => e.short_effect || e.effect),
        };
        res.status(200).json(treatedData);
    } catch (error) {
        error.message = error.message || `Error fetching item details for ${nameOrId}`;
        next(error);
    }
};