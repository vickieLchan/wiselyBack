import mongoDb from 'mongodb';
import { DateTime } from 'luxon'

export const getTimeBucket = (date) => {
  const dt = (new DateTime(date)).toLocaleString(DateTime.TIME_24_SIMPLE)
  const hrs = Number(dt.split(':')[0])
  const min = Number(dt.split(':')[1])
  return Math.floor(min / 15) + (hrs * 4);
}

export const getRestaurant = async (db, id) => {
  return db.collection('restaurants').find({ "_id": id }).toArray()
}

export const getInventoryDate = (date) => {
  const dt = new Date(Number(date));

  return new Date(
    dt.getFullYear(),
    dt.getMonth(),
    dt.getDate() + 1
  )
}

export const convertId = (id) => new mongoDb.ObjectId(id)