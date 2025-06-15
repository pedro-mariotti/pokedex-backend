import PokeTeam from "../model/PokeTeam.js";
import User from "../model/User.js"; // Import User model if needed for validation

// Criar uma nova PokeTeam
export const createPokeTeam = async (req, res, next) => {
  const { UserId, teamName, pokemonNames } = req.body;

  if (!UserId || !teamName || !pokemonNames) {
    return res
      .status(400)
      .json({ message: "UserId, teamName e pokemonNames são obrigatórios." });
  }

  try {
    // Opcional: Verificar se o UserId existe
    const userExists = await User.findById(UserId);
    if (!userExists) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    const newPokeTeam = new PokeTeam({
      UserId,
      teamName,
      pokemonNames,
    });

    const savedPokeTeam = await newPokeTeam.save();
    res.status(201).json(savedPokeTeam);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

// Buscar todas as PokeTeams de um usuário específico
export const getPokeTeamsByUser = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const pokeTeams = await PokeTeam.find({ UserId: userId });
    if (!pokeTeams || pokeTeams.length === 0) {
      return res.status(404).json({
        message: "Nenhuma equipe Pokémon encontrada para este usuário.",
      });
    }
    res.status(200).json(pokeTeams);
  } catch (error) {
    next(error);
  }
};

// Buscar uma PokeTeam específica pelo ID da equipe
// Esta função retorna todos os detalhes, incluindo nome do time, pokémons e ID do jogador.
export const getPokeTeamById = async (req, res, next) => {
  const { teamId } = req.params;
  try {
    const pokeTeam = await PokeTeam.findById(teamId);
    if (!pokeTeam) {
      return res
        .status(404)
        .json({ message: "Equipe Pokémon não encontrada." });
    }
    res.status(200).json(pokeTeam);
  } catch (error) {
    next(error);
  }
};

// Editar uma PokeTeam existente
export const updatePokeTeam = async (req, res, next) => {
  const { teamId } = req.params;
  const { teamName, pokemonNames } = req.body;

  try {
    const pokeTeam = await PokeTeam.findById(teamId);
    if (!pokeTeam) {
      return res
        .status(404)
        .json({ message: "Equipe Pokémon não encontrada para atualizar." });
    }

    // TODO: Implementar verificação de autorização.
    // Ex: if (pokeTeam.UserId.toString() !== req.user.id) { // req.user.id viria de um middleware de autenticação
    //   return res.status(403).json({ message: "Você não tem permissão para editar esta equipe." });
    // }

    if (teamName) {
      pokeTeam.teamName = teamName;
    }
    if (pokemonNames) {
      pokeTeam.pokemonNames = pokemonNames;
    }

    const updatedPokeTeam = await pokeTeam.save(); // .save() irá rodar as validações do schema
    res.status(200).json(updatedPokeTeam);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

// Apagar uma PokeTeam
export const deletePokeTeam = async (req, res, next) => {
  const { teamId } = req.params;
  try {
    const pokeTeam = await PokeTeam.findById(teamId);
    if (!pokeTeam) {
      return res
        .status(404)
        .json({ message: "Equipe Pokémon não encontrada para deletar." });
    }

    // TODO: Implementar verificação de autorização.
    // Ex: if (pokeTeam.UserId.toString() !== req.user.id) { // req.user.id viria de um middleware de autenticação
    //   return res.status(403).json({ message: "Você não tem permissão para deletar esta equipe." });
    // }

    await PokeTeam.findByIdAndDelete(teamId);
    res.status(200).json({ message: "Equipe Pokémon deletada com sucesso." });
  } catch (error) {
    next(error);
  }
};
