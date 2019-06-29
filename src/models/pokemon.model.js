const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);

//schema?
const pokemonSchema = new mongoose.Schema(
  {
    name: {
      english: { type: String, required: true },
      japanese: { type: String },
      chinese: { type: String }
    },
    base: {
      HP: { type: Number, required: true },
      Attack: { type: Number, required: true },
      Defense: { type: Number, required: true },
      SpAttack: { type: Number, required: true },
      SpDefence: { type: Number, required: true },
      Speed: { type: Number, required: true }
    },
    type: { type: [String], required: true },
    id: { type: Number, unique: true }
  },
  {
    versionKey: false
  }
);

//call model
mongoose.model("Pokemon", pokemonSchema);
