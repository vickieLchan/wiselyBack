
export const getTimeBucket = (date) => {
  return Math.floor(date.getMinutes() / 15) + (date.getHours() * 4);
}