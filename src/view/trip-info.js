import AbstractView from './abstract';
import {convertDateToISO, formatDate, sortDates} from '../utils/date';

const MAX_DESTINATIONS_COUNT = 3;

const generateTitleTripDestinations = (allTripDestinations) => {

  if (allTripDestinations.length <= MAX_DESTINATIONS_COUNT) {
    return allTripDestinations.join(' &mdash; ');
  }

  return `${allTripDestinations[0]} &mdash; ... &mdash; ${allTripDestinations[allTripDestinations.length - 1]}`;
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

  allTripDates.sort(sortDates);

  const allTripDestinations = [...new Set(points.map((point) => point.destination.name))];

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

export default class TripInfo extends AbstractView {
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    return createTripInfoTemplate(this._points);
  }
}
