const app = require("../src/app");
const request = require("supertest");
const { MongoClient } = require("mongodb");
const pokemonData = require("../data/pokemonData");
const mongoose = require("mongoose");

describe("Pokemon route", () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(global.__MONGO_URI__, {
      useNewUrlParser: true
    });
    const uriSplit = global.__MONGO_URI__.split("/");
    const realDBName = uriSplit[uriSplit.length - 1];
    db = await connection.db(realDBName);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await connection.close();
  });

  beforeEach(async () => {
    await db.dropDatabase();
    const pokemons = db.collection("pokemons");
    await pokemons.insertMany(pokemonData);
  });

  it("GET / should get all the pokemons", async () => {
    const response = await request(app).get("/pokemon");
    expect(response.status).toEqual(200);
    expect(response.body).toMatchObject(pokemonData);
  });

  it("POST / should create a new pokemon", async () => {
    const newData = {
      name: {
        english: "Charmander",
        japanese: "ヒトカゲ",
        chinese: "小火龙"
      },
      base: {
        HP: 39,
        Attack: 52,
        Defense: 43,
        SpAttack: 60,
        SpDefence: 50,
        Speed: 65
      },
      type: ["Fire"],
      id: 4
    };
    const response = await request(app)
      .post("/pokemon")
      .send(newData);
    expect(response.status).toEqual(201);
    expect(response.body).toMatchObject([newData]);

    //check data contains newData
    const pokemons = db.collection("pokemons");
    const found = await pokemons.findOne({ "name.english": "Charmander" });
    expect(found).toMatchObject(newData);
  });

  it("GET /id should return pokemon data with that id", async () => {
    const response = await request(app).get("/pokemon/7");
    const pokemons = db.collection("pokemons");
    const dbFound = await pokemons.findOne({ id: 7 });
    expect(response.status).toEqual(200);
    expect(response.body).toMatchObject(dbFound);
  });

  it("PUT /id should updated pokemon data with that id", async () => {
    const updatedFields = {
      name: {
        english: "Brandon"
      }
    };

    const response = await request(app)
      .put("/pokemon/7")
      .send(updatedFields);

    expect(response.status).toEqual(200);
    const pokemons = db.collection("pokemons");
    const dbFound = await pokemons.findOne({ id: 7 });
    expect(dbFound.name.english).toEqual(updatedFields.name.english);
  });

  it("DELETE /id should delete pokemon data with that id", async () => {
    const pokemons = db.collection("pokemons");
    const response = await request(app).delete("/pokemon/7");
    expect(response.status).toEqual(202);

    //should be deleted in database
    const foundPostDelete = await pokemons.findOne({ id: 7 });
    expect(foundPostDelete).toBeNull;
  });
});
