import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';

import { restaurantsController } from './controllers/index.js';

const app = express();
const port = 3333;

export default async () => {
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(morgan('tiny'));


  app.use('/restaurants', restaurantsController);

  app.use('/', (req, res, next) => {
    res.status(404).send(`Route not found`);
  });

  app.use((err, req, res, next) => {
    console.error(err.message, err.stack);
    res.status(500).send(`ERROR--> ${err}`);
  });

  await app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  })
}