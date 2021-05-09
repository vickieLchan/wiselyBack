import express from 'express';
import { getDb } from '../../db/index.js';

const restaurants = express.Router()

restaurants.get('/', async (req, res, next) => {
  try {
    console.log('madeIt')
    const db = getDb()
    console.log(db)
    const restaurants = await db.restaurants.findAll()
    console.log(restaurants)
    res.status(200).send(restaurants)
  } catch (err) {
    console.log('err--->', err)
    next(err)
  }
});

export default restaurants;