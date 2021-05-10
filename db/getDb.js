import Mongo from 'mongodb';

const { MongoClient } = Mongo

let client
let db
const url = 'mongodb://localhost:27017';

export default async (dbName = 'reservations') => {
  if (!client || !db) {
    client = new MongoClient(url);

    await client.connect();

    db = await client.db(dbName);
  }

  return db
}