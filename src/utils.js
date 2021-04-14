import dayjs from 'dayjs';

export const formatDate = (date, format) => {
  if (format && date) {
    return dayjs(date).format(format);
  }

  return dayjs();
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

export const calculateDuration = (dateFrom, dateTo) => {
  const duration = (dateTo - dateFrom);
  const minutes = (duration / (1000 * 60)).toFixed(0);
  const hours = (duration / (1000 * 60 * 60)).toFixed(0);
  const days = (duration / (1000 * 60 * 60 * 24)).toFixed(0);

  const restOfHours = hours % 24;
  const restOfMinutes = minutes % 60;

  if (minutes < 60) {
    return `${minutes}M`;
  } else if (hours < 24) {
    return `${hours}H ${restOfMinutes}M`;
  }

  return `${days}D ${restOfHours}H ${restOfMinutes}M`;
};

export const RenderPlace = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};

export const render = (container, element, place = RenderPlace.BEFOREEND) => {
  switch (place) {
    case RenderPlace.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPlace.BEFOREEND:
      container.append(element);
      break;
  }
};

export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstChild;
};
