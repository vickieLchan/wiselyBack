import Mongo from 'mongodb';
import initSchema from './schema.js'
import seedData from './seedData.js'

const { MongoClient } = Mongo

  ; (async () => {

    const url = 'mongodb://localhost:27017';

    const dbName = 'reservations';
    const client = new MongoClient(url);
    return client.connect(async function (err) {
      console.log('Connected successfully to server');

      const db = client.db(dbName);
      try {

        await db.dropDatabase();
        await initSchema(db);

        await db.collection('restaurants').insertMany(seedData.restaurants);

        await client.close();
      } catch (err) {
        console.log(err)
      }
    });
  })();