const second = 1000;
const minute = 60 * second;
const hour = 60 * minute;
const day = 24 * hour;

export const timeframeInMs = {
  '1MIN': minute,
  '5MINS': 5 * minute,
  '15MINS': 15 * minute,
  '30MINS': 30 * minute,
  '1HOUR': hour,
  '4HOURS': 4 * hour,
  '1DAY': day,
};
