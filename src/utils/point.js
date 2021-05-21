import dayjs from 'dayjs';

export const SortType = {
  DAY: 'sort-day',
  TIME: 'sort-time',
  PRICE: 'sort-price',
};

export const sortPointPrice = (pointA, pointB) => pointB.basePrice - pointA.basePrice;

export const sortPointDay = (pointA, pointB) => dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));

export const sortPointTime = (pointA, pointB) => {
  const durationA = pointA.dateTo - pointA.dateFrom;
  const durationB = pointB.dateTo - pointB.dateFrom;
  return durationB - durationA;
};

export const getOfferUid = (value) => `event-offer-${value}`;
