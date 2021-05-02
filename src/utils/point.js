import dayjs from 'dayjs';

export const SortType = {
  DAY: 'sort-day',
  TIME: 'sort-time',
  PRICE: 'sort-price',
};

export const sortPointPrice = (pointA, pointB) => pointB.base_price - pointA.base_price;

export const sortPointDay = (pointA, pointB) => dayjs(pointA.date_from).diff(dayjs(pointB.date_from));

export const sortPointTime = (pointA, pointB) => {
  const durationA = pointA.date_to - pointA.date_from;
  const durationB = pointB.date_to - pointB.date_from;
  return durationB - durationA;
};
