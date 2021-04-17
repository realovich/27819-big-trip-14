export const Key = {
  ESC: 'Esc',
  ESCAPE: 'Escape',
};

export const Evt = {
  CLICK: 'click',
  KEYDOWN: 'keydown',
  SUBMIT: 'submit',
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
