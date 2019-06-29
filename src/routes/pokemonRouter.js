const express = require("express");
const pokemonRouter = express.Router();
require("../models/pokemon.model");
require("../../utils/db");
const mongoose = require("mongoose");
const Pokemon = mongoose.model("Pokemon");
const flatten = require("flat");

pokemonRouter.get("/", async (req, res) => {
  const allData = await Pokemon.find();
  res.status(200).json(allData);
});

pokemonRouter.post("/", async (req, res) => {
  const newData = req.body;
  const inserted = await Pokemon.insertMany(newData);
  res.status(201).json(inserted);
});

pokemonRouter.get("/:id", async (req, res) => {
  const found = await Pokemon.findOne({ id: req.params.id });
  res.status(200).json(found);
});

pokemonRouter.put("/:id", async (req, res) => {
  console.log(flatten(req.body));
  await Pokemon.findOneAndUpdate({ id: req.params.id }, flatten(req.body));
  res.sendStatus(200);
});
pokemonRouter.delete("/:id", async (req, res) => {
  const deleted = await Pokemon.deleteOne({ id: req.params.id });
  res.sendStatus(202);
});

module.exports = pokemonRouter;
