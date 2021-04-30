import dayjs from 'dayjs';

export const Key = {
  ESC: 'Esc',
  ESCAPE: 'Escape',
};

export const Evt = {
  CLICK: 'click',
  KEYDOWN: 'keydown',
  SUBMIT: 'submit',
  CHANGE: 'change',
};

export const SortType = {
  DAY: 'sort-day',
  TIME: 'sort-time',
  PRICE: 'sort-price',
};

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomArrayElement = (array) => {
  const randomIndex = getRandomInteger(0, array.length - 1);

  return array[randomIndex];
};

export const updateItem = (items, updatedItem) => {
  const index = items.findIndex((item) => item.id === updatedItem.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    updatedItem,
    ...items.slice(index + 1),
  ];
};

export const sortPointPrice = (pointA, pointB) => pointB.base_price - pointA.base_price;

export const sortPointDay = (pointA, pointB) => dayjs(pointA.date_from).diff(dayjs(pointB.date_from));

export const sortPointTime = (pointA, pointB) => {
  const durationA = pointA.date_to - pointA.date_from;
  const durationB = pointB.date_to - pointB.date_from;
  return durationB - durationA;
};
