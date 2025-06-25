import PokeTeam from '../model/PokeTeam.js';
import User from '../model/User.js';

/**
 * Encontra todos os PokeTeams pertencentes a um usuário, identificado pelo seu nome de usuário.
 * @param {string} username - O nome de usuário do usuário.
 * @returns {Promise<Array>} Uma promessa que resolve para um array de PokeTeams.
 * @throws {Error} Se o usuário não for encontrado.
 */
export const findTeamsByUsername = async (username) => {
    // Encontra o usuário pelo nome de usuário para obter seu ID
    const user = await User.findOne({ username: username });

    if (!user) {
        const err = new Error(`User with username '${username}' not found.`);
        err.statusCode = 404;
        throw err;
    }

    // Encontra todos os times associados ao ID do usuário
    const teams = await PokeTeam.find({ UserId: user._id });
    return teams;
};

/**
 * Encontra todos os PokeTeams que correspondem a um determinado nome de time (parcial, sem distinção entre maiúsculas e minúsculas).
 * @param {string} teamName - O nome do time para pesquisar.
 * @returns {Promise<Array>} Uma promessa que resolve para um array de PokeTeams.
 */
export const findTeamsByTeamName = async (teamName) => {
    // Usa uma expressão regular para uma pesquisa case-insensitive
    const teams = await PokeTeam.find({ teamName: { $regex: teamName, $options: 'i' } });
    return teams;
};