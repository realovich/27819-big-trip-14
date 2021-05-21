import dayjs from 'dayjs';
import {nanoid} from 'nanoid';
import {getRandomInteger, getRandomArrayElement} from '../utils/common';

const generateDateFrom = () => {
  const minMinutesGap = 4;
  const maxMinutesGap = 4 * 24 * 60;
  const daysGap = getRandomInteger(minMinutesGap, maxMinutesGap);

  return dayjs().subtract(daysGap, 'minutes').toDate();
};

const generateDateTo = () => {
  const minMinutesGap = 4;
  const maxMinutesGap = 4 * 24 * 60;
  const daysGap = getRandomInteger(minMinutesGap, maxMinutesGap);

  return dayjs().add(daysGap, 'minutes').toDate();
};

const pointPrices = [20, 50, 120, 160, 180, 600];

const generatePointDestinationDescription = () => {
  const string = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus';

  const sentences = string.split('. ');
  const numberOfOffers = getRandomInteger(1, 5);

  const destinationDescription = [];

  for (let i = 0; i < numberOfOffers; i++) {
    const indexOfSentences = getRandomInteger(0, sentences.length - 1);
    destinationDescription.push(sentences[indexOfSentences]);
  }

  return destinationDescription.join('. ');
};

const generatePointDestinationPhotos = () => {
  const numberOfPhotos = getRandomInteger(1, 5);

  const photos = [];

  for (let i = 0; i < numberOfPhotos; i++) {
    photos.push(`http://picsum.photos/248/152?r=${getRandomInteger(1, 100)}`);
  }

  return photos;
};

const generatePointOffers = (array, type) => {
  const offersObject = array.find((element) => element.type == type);
  const shuffledQuantity = getRandomInteger(0, array.length - 1);

  if (offersObject) {
    return offersObject.offers.slice(0, shuffledQuantity);
  }

  return [];
};

export const pointDestinationNames = ['Amsterdam', 'Chamonix', 'Geneva', 'Moscow', 'Paris'];

export const generateDestinations = () => {
  const destinations = [];

  pointDestinationNames.forEach((destinationName) => {
    destinations.push({
      name: destinationName,
      description: generatePointDestinationDescription(),
      pictures: generatePointDestinationPhotos(),
    });
  });

  return destinations;
};

export const types = ['taxi', 'bus', 'train', 'ship', 'transport', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

export const generateOffers = () => {
  const offers = [
    {
      type: 'taxi',
      offers: [
        {
          title: 'Order Vkontakte',
          price: 10,
        }, {
          title: 'Order City Mobil',
          price: 15,
        }, {
          title: 'Order Uber',
          price: 20,
        }, {
          title: 'Order Yandex Taxi',
          price: 20,
        }, {
          title: 'Order Business Class',
          price: 30,
        },
      ],
    }, {
      type: 'flight',
      offers: [
        {
          title: 'Choose seats',
          price: 5,
        }, {
          title: 'Add meal',
          price: 20,
        }, {
          title: 'Switch to comfort class',
          price: 50,
        },
      ],
    }, {
      type: 'check-in',
      offers: [
        {
          title: 'Add breakfast',
          price: 5,
        }, {
          title: 'Add luggage',
          price: 10,
        }, {
          title: 'Mini bar',
          price: 20,
        }, {
          title: 'Cable TV',
          price: 25,
        }, {
          title: 'Wi-Fi',
          price: 30,
        },
      ],
    }, {
      type: 'drive',
      offers: [
        {
          title: 'Order carsharing',
          price: 20,
        }, {
          title: 'Hire a driver',
          price: 20,
        },
      ],
    },
  ];

  offers.forEach((element) => {
    element.offers.forEach((innerElement) => {
      const {title, price} = innerElement;
      const shortname = title.split(' ').join('') + price;

      innerElement['shortname'] = shortname.toLocaleLowerCase();
    });
  });

  return offers;
};

export const generatePoint = () => {
  const dateFrom = generateDateFrom();
  const dateTo = generateDateTo();
  const type = getRandomArrayElement(types);

  return {
    id: nanoid(),
    basePrice: getRandomArrayElement(pointPrices),
    dateFrom,
    dateTo,
    destination: getRandomArrayElement(generateDestinations()),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    type,
    offers: generatePointOffers(generateOffers(), type),
  };
};
