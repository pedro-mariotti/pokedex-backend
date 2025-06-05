import mongoose from "mongoose";

const PokeTeamSchema = new mongoose.Schema({
  UserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  teamName: {
    type: String,
    required: true,
    trim: true,
  },
  pokemonNames: {
    type: [String],
    required: true,
    validate: {
      validator: function (arr) {
        return arr.length <= 6; // A team can have up to 6 Pokémon
      },
      message: "A team can have a maximum of 6 Pokémon.",
    },
  },
});

const PokeTeam = mongoose.model("PokeTeam", PokeTeamSchema);
export default PokeTeam;