const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qthn2pl.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db;

async function connectDB() {
  if (db) return db;

  await client.connect();
  db = client.db("shop");

  await client.db("admin").command({ ping: 1 });
  console.log("Pinged your deployment. You successfully connected to MongoDB!");

  return db;
}

function getDB() {
  if (!db) {
    throw new Error("Database not initialized. Call connectDB() before using getDB().");
  }
  return db;
}

module.exports = { connectDB, getDB, client };
