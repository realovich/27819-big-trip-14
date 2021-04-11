import dayjs from 'dayjs';

export const createTripInfoTemplate = (points) => {
  const tripCost = points.reduce((sum, current) => {
    const pointOffersCost = current.offers.reduce((sumOffers, currentOffer) => sumOffers + currentOffer.price, 0);

    return sum + current.base_price + pointOffersCost;
  }, 0);

  const allTripDates = [];

  points.forEach((point) => {
    allTripDates.push(dayjs(point.date_from).toISOString(), dayjs(point.date_to).toISOString());
  });

  const allTripDestinations = new Set();

  points.forEach((point) => {
    allTripDestinations.add(point.destination.name);
  });

  const generateTitleTripDestinations = () => {
    const allTripDestinationsArray = Array.from(allTripDestinations);

    if (allTripDestinationsArray.length < 4) {
      return allTripDestinationsArray.join(' &mdash; ');
    }

    return `${allTripDestinationsArray[0]} &mdash; ... &mdash; ${allTripDestinationsArray[allTripDestinationsArray.length - 1]}`;
  };

  return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${generateTitleTripDestinations()}</h1>

      <p class="trip-info__dates">${dayjs(allTripDates[0]).format('MMM DD')}&nbsp;&mdash;&nbsp;${dayjs(allTripDates[allTripDates.length - 1]).format('MMM DD')}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${tripCost}</span>
    </p>
  </section>`;
};
