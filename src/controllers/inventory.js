import express from 'express';
import mongoDb from 'mongodb';

import { getDb } from '../../db/index.js';
import { convertId, getRestaurant, getInventoryDate } from '../utils/index.js';

const controllerName = 'inventory'
const inventoryRouter = express.Router({ mergeParams: true })

inventoryRouter.get('/:date', async (req, res, next) => {
  console.log('/:restaurantId/inventory/:date')
  const { date, restaurantId } = req.params
  const inventoryDate = getInventoryDate(date);

  try {
    const db = await getDb();
    const inventory = await db.collection(controllerName).findOne({ restaurant_id: restaurantId, date: inventoryDate })
    return res.status(200).json(inventory)
  } catch (err) {
    next(err)
  }
});

inventoryRouter.post('/:date', async (req, res, next) => {
  console.log('POST /:restaurantId/inventory')
  const { restaurantId, date } = req.params;
  const { availability, reserved, is_default = false } = req.body;

  const inventoryDate = getInventoryDate(date);
  const restaurant_id = convertId(restaurantId);
  try {

    const db = await getDb()
    const inventory = await db.collection(controllerName)
    const restaurant = await getRestaurant(db, restaurant_id)

    if (!restaurant) {
      return next(new Error(`restaurant ${restaurant_id} not found`))
    }

    if (is_default) {
      await inventory.updateMany(
        {
          restaurant_id,
          is_default: true,
          date: { $ne: inventoryDate }
        },
        { $set: { is_default: false } }
      );
    }

    const created = await inventory.updateOne(
      { restaurant_id, date: inventoryDate },
      {
        $set: {
          restaurant_id,
          date: inventoryDate,
          availability,
          reserved,
          is_default
        }
      },
      { upsert: true }
    );

    return res.status(201).send(await inventory.findOne({
      restaurant_id,
      date: inventoryDate,
    }))
  } catch (err) {
    console.log(err)
    next(err)
  }
});

export default inventoryRouter;