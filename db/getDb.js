import Mongo from 'mongodb';

const { MongoClient } = Mongo

let client
let db
const url = 'mongodb://localhost:27017';

export default async (dbName = 'reservations') => {
  if (!client || !db) {
    client = new MongoClient(url);

    await client.connect(async function (err) {
      console.log('Connected successfully to server');

      db = client.db(dbName);
    });
  }

  return db
}