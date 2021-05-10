import express from 'express';
import { getDb } from '../../db/index.js';
import { convertId, getInventoryDate, getTimeBucket } from '../utils/index.js'

const controllerName = 'reservations'
const reservationRouter = express.Router({ mergeParams: true })

const reservationAvailable = (availability, reserved, bucket) => {
  if (reserved[bucket].length < availability[bucket]) {
    return true;
  }
  return false;
}

reservationRouter.get('/:date', async (req, res, next) => {
  console.log('/:restaurantId/inventory/:date')
  const { date, restaurantId } = req.params

  const inventoryDate = getInventoryDate(date)

  try {
    const db = await getDb();
    const reservations = await db.collection(controllerName).find({
      restaurant_id: restaurantId,
      date: {
        "$gte": inventoryDate,
        "$lt": new Date(inventoryDate.valueOf() + (24 * 60 * 60 * 1000))
      }
    }).toArray();

    return res.status(200).json(reservations)
  } catch (err) {
    next(err)
  }
});

reservationRouter.post('/:date', async (req, res, next) => {
  console.log('/:restaurantId/inventory/:date')
  const { date, restaurantId } = req.params
  const { email, name, partySize } = req.body
  const inventoryDate = getInventoryDate(date)
  const inventoryBucket = getTimeBucket(date);
  const restaurant_id = convertId(restaurantId);
  try {
    const db = await getDb();
    const inventoryCollection = await db.collection('inventory');
    const reservationCollection = await db.collection(controllerName);
    let inventory = await inventoryCollection.findOne({
      restaurant_id,
      date: inventoryDate
    });

    if (!inventory) {
      const defaultInventory = await inventoryCollection.findOne({
        restaurant_id: restaurantId,
        is_default: true
      });

      if (!defaultInventory) {
        return res.status(404).send(`no inventory available on ${inventoryDate} for restaurant ${restaurantId}`)
      }

      const createdInventory = await inventoryCollection.insertOne({
        restaurant_id,
        date: inventoryDate,
        availability: defaultInventory.availability,
        reserved: new Array(96).fill([]),
        is_default: false
      });

      inventory = createdInventory.ops[0];
    }

    if (reservationAvailable(inventory.availability, inventory.reserved, inventoryBucket)) {
      const reservation = await reservationCollection.insertOne(
        {
          restaurant_id,
          name,
          email,
          party_size: partySize,
          date: new Date(Number(date))
        },
      );
      const resDoc = reservation.ops[0];
      const updatedRes = inventory.reserved[inventoryBucket].concat([resDoc._id])
      inventory.reserved.splice(inventoryBucket, 1, updatedRes);

      await inventoryCollection.updateOne(
        { restaurant_id, date: inventoryDate },
        {
          $set: {
            reserved: inventory.reserved
          },
        }
      );

      return res.status(201).json(resDoc)
    } else {
      return res.status(409).send(`no availability for ${new Date(date)} at restaurant ${restaurantId}`)
    }
  } catch (err) {
    next(err)
  }
});

export default reservationRouter;