import AbstractView from './abstract';
import {Evt} from '../utils/common';
import {formatDate, currentDate} from '../utils/date';
import {types} from '../mock/point';

const BLANK_POINT = {
  base_price: '',
  date_from: currentDate(),
  date_to: currentDate(),
  destination: null,
  type: 'taxi',
  offers: [],
};

const createPointEditTypesTemplate = (selectedType) => {
  return types.map((pointType) => `<div class="event__type-item">
    <input id="event-type-${pointType.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${pointType.toLowerCase()}"${selectedType === pointType ? ' checked' : ''}>
    <label class="event__type-label  event__type-label--${pointType.toLowerCase()}" for="event-type-${pointType.toLowerCase()}-1">${pointType}</label>
  </div>`).join('');
};

const createPointEditDestinationListTemplate = (destinations) => {
  return destinations.map((pointDestination) => `<option value="${pointDestination}"></option>`).join('');
};

const createPointEditPhotosTemplate = (photos) => {
  if (photos.length === 0) {
    return '';
  }

  const photosList = photos.map((photo) => `<img class="event__photo" src="${photo}" alt="Event photo">`).join('');

  return `<div class="event__photos-container">
    <div class="event__photos-tape">
      ${photosList}
    </div>
  </div>`;
};

const createPointEditDestinationSectionTemplate = (destination) => {
  if (destination === null) {
    return '';
  }

  const photosTemplates = createPointEditPhotosTemplate(destination.pictures);

  return `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${destination.description}</p>

    ${photosTemplates}
  </section>`;
};

const createPointEditOffersTemplate = (offersOfType, pointOffers, pointType) => {
  if (offersOfType.length === 0) {
    return '';
  }

  const offersOfTypeItem = offersOfType.find((item) => item.type === pointType);

  if (!offersOfTypeItem) {
    return '';
  }

  const createPointAddOffersListTemplate = offersOfTypeItem.offers.map((offer) => `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.shortname}" type="checkbox" name="event-offer-${offer.shortname}" ${pointOffers.some((pointOffer) => pointOffer.shortname == offer.shortname) && 'checked'}>
    <label class="event__offer-label" for="event-offer-${offer.shortname}">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </label>
  </div>`).join('');

  return `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

    <div class="event__available-offers">
      ${createPointAddOffersListTemplate}
    </div>
  </section>`;
};

const createPointEditTemplate = (point = {}, offersOfType, destinations) => {
  const {base_price, date_from, date_to, destination, type, offers} = point;

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>

              ${createPointEditTypesTemplate(type)}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination ? destination.name : ''}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${createPointEditDestinationListTemplate(destinations)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formatDate(date_from, 'DD/MM/YY HH:mm')}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formatDate(date_to, 'DD/MM/YY HH:mm')}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${base_price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        ${createPointEditOffersTemplate(offersOfType, offers, type)}

        ${createPointEditDestinationSectionTemplate(destination)}
      </section>
    </form>
  </li>`;
};

export default class PointEdit extends AbstractView {
  constructor(point = BLANK_POINT, offers, destinationNames) {
    super();
    this._point = point;
    this._offers = offers;
    this._destinationNames = destinationNames;
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._closeEditClickHandler = this._closeEditClickHandler.bind(this);
  }

  getTemplate() {
    return createPointEditTemplate(this._point, this._offers, this._destinationNames);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(this._point);
  }

  _closeEditClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeEditClick();
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector('form').addEventListener(Evt.SUBMIT, this._formSubmitHandler);
  }

  setCloseEditClickHandler(callback) {
    this._callback.closeEditClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener(Evt.CLICK, this._closeEditClickHandler);
  }
}
