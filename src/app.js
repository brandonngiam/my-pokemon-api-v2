const express = require("express");
const app = express();
const pokemonRoute = require("./routes/pokemonRouter");

app.use(express.json());

app.use("/pokemon", pokemonRoute);

app.use((err, req, res, next) => {
  res.sendStatus(err.status || 500);
});

module.exports = app;
