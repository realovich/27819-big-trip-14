import {createElement, convertDateToISO, formatDate} from '../utils';

const MAX_DESTINATIONS_COUNT = 3;

const generateTitleTripDestinations = (setObject) => {
  const allTripDestinationsArray = Array.from(setObject);

  if (allTripDestinationsArray.length <= MAX_DESTINATIONS_COUNT) {
    return allTripDestinationsArray.join(' &mdash; ');
  }

  return `${allTripDestinationsArray[0]} &mdash; ... &mdash; ${allTripDestinationsArray[allTripDestinationsArray.length - 1]}`;
};

const createTripInfoTemplate = (points) => {
  if (points.length === 0) {
    return ' ';
  }

  const tripCost = points.reduce((sum, current) => {
    const pointOffersCost = current.offers.reduce((sumOffers, currentOffer) => sumOffers + currentOffer.price, 0);

    return sum + current.base_price + pointOffersCost;
  }, 0);

  const allTripDates = [];

  points.forEach((point) => {
    allTripDates.push(convertDateToISO(point.date_from), convertDateToISO(point.date_to));
  });

  const allTripDestinations = new Set();

  points.forEach((point) => {
    allTripDestinations.add(point.destination.name);
  });

  return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${generateTitleTripDestinations(allTripDestinations)}</h1>

      <p class="trip-info__dates">${formatDate(allTripDates[0], 'MMM DD')}&nbsp;&mdash;&nbsp;${formatDate(allTripDates[allTripDates.length - 1], 'MMM DD')}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${tripCost}</span>
    </p>
  </section>`;
};

export default class TripInfo {
  constructor(points) {
    this._points = points;
    this._element = null;
  }

  getTemplate() {
    return createTripInfoTemplate(this._points);
  }

  getElement() {
    if(!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
