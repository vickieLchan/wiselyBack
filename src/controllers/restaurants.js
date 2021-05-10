import express from 'express';

import { getDb } from '../../db/index.js';
import { convertId } from '../utils/index.js';
import inventoryRouter from './inventory.js';
import reservationRouter from './reservations.js';

const controllerName = 'restaurants'
const restaurantsRouter = express.Router()

restaurantsRouter.use('/:restaurantId/inventory', inventoryRouter);
restaurantsRouter.use('/:restaurantId/reservations', reservationRouter);

restaurantsRouter.get('/:restaurantId', async (req, res, next) => {
  const { restaurantId } = req.params
  console.log('idRoute', restaurantId)
  const db = getDb()
  try {
    const restaurant = await getRestaurant(db, convertId(restaurantId))
    res.status(200).json(restaurant)
  } catch (err) {
    next(err)
  }
});

restaurantsRouter.get('/', async (req, res, next) => {
  console.log('/ route')
  try {
    const db = await getDb()
    const restaurants = await db.collection(controllerName).find().toArray()
    res.status(200).json(restaurants)
  } catch (err) {
    next(err)
  }
});

export default restaurantsRouter;