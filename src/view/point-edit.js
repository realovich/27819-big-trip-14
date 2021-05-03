import SmartView from './smart';
import {Evt} from '../utils/common';
import {formatDate, currentDate} from '../utils/date';
import {types} from '../mock/point';
import flatpickr from 'flatpickr';

import '../../node_modules/flatpickr/dist/flatpickr.min.css';

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
    <input id="event-type-${pointType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${pointType}"${selectedType === pointType ? ' checked' : ''}>
    <label class="event__type-label  event__type-label--${pointType}" for="event-type-${pointType}-1">${pointType}</label>
  </div>`).join('');
};

const createPointEditDestinationListTemplate = (destinations) => {
  return destinations.map((pointDestination) => `<option value="${pointDestination.name}"></option>`).join('');
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

export default class PointEdit extends SmartView {
  constructor(point = BLANK_POINT, offers, destinations) {
    super();
    this._data = point;
    this._offers = offers;
    this._destinations = destinations;
    this._dateFromPicker = null;
    this._dateToPicker = null;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._closeEditClickHandler = this._closeEditClickHandler.bind(this);
    this._eventTypeChangeHandler = this._eventTypeChangeHandler.bind(this);
    this._eventDestinationChangeHandler = this._eventDestinationChangeHandler.bind(this);
    this._dateFromChangeHandler = this._dateFromChangeHandler.bind(this);
    this._dateToChangeHandler = this._dateToChangeHandler.bind(this);

    this._setInnerHandlers();
    this._initDateFromInstance();
    this._initDateToInstance();
  }

  getTemplate() {
    return createPointEditTemplate(this._data, this._offers, this._destinations);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._initDateFromInstance();
    this._initDateToInstance();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setCloseEditClickHandler(this._callback.closeEditClick);
  }

  _getDatepickerInstance(element, date, callback) {
    return flatpickr(
      this.getElement().querySelector(element),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: date,
        onChange: callback,
      },
    );
  }

  _initDateFromInstance() {
    if (this._dateFromPicker) {
      this._dateFromPicker.destroy();
      this._dateFromPicker = null;
    }

    this._dateFromPicker = this._getDatepickerInstance('#event-start-time-1', this._data.date_from, this._dateFromChangeHandler);
  }

  _initDateToInstance() {
    if (this._dateToPicker) {
      this._dateToPicker.destroy();
      this._dateToPicker = null;
    }

    this._dateToPicker = this._getDatepickerInstance('#event-end-time-1', this._data.date_to, this._dateToChangeHandler);
  }

  _setInnerHandlers() {
    this.getElement().querySelector('.event__type-group').addEventListener(Evt.CHANGE, this._eventTypeChangeHandler);
    this.getElement().querySelector('.event__input--destination').addEventListener(Evt.CHANGE, this._eventDestinationChangeHandler);
  }

  _eventTypeChangeHandler(evt) {
    evt.preventDefault();

    this.updateData({
      type: evt.target.value,
    });
  }

  _eventDestinationChangeHandler(evt) {
    evt.preventDefault();

    const currentDestination = this._destinations.find((destination) => destination.name === evt.target.value);

    if (!currentDestination) {
      return;
    }

    this.updateData({
      destination: currentDestination,
    });
  }

  _dateFromChangeHandler([userDate]) {
    this.updateData({
      date_from: userDate,
    });
  }

  _dateToChangeHandler([userDate]) {
    this.updateData({
      date_to: userDate,
    });
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(this._data);
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
