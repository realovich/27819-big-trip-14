import SmartView from './smart';
import {getOfferUid} from '../utils/point';
import {formatDate, getCurrentDate} from '../utils/date';
import {POINT_TYPES, Evt, FormControlState} from '../utils/const';
import flatpickr from 'flatpickr';

import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const BLANK_POINT = {
  basePrice: '',
  dateFrom: getCurrentDate(),
  dateTo: getCurrentDate(),
  destination: null,
  type: 'taxi',
  offers: [],
  isFavorite: false,
};

const createPointEditTypesTemplate = (selectedType, isDisabled) => {
  return POINT_TYPES.map((type) => `<div class="event__type-item">
    <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}"${selectedType === type ? ' checked' : ''} ${isDisabled ? FormControlState.DISABLED : ''}>
    <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
  </div>`).join('');
};

const createPointEditDestinationListTemplate = (destinations) => {
  return destinations.map((pointDestination) => `<option value="${pointDestination.name}"></option>`).join('');
};

const createPointEditPhotosTemplate = (photos) => {
  if (photos.length === 0) {
    return '';
  }

  const photosList = photos.map((photo) => `<img class="event__photo" src="${photo.src}" alt="${photo.description}">`).join('');

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

const createPointEditOffersTemplate = (availablePointOffers, pointOffers, isDisabled) => {
  if (availablePointOffers.length === 0) {
    return '';
  }

  const createPointAddOffersListTemplate = (offers) => {
    return offers.map((offer) => {
      const offerUid = getOfferUid(offer);
      const isOfferChecked = pointOffers.some((pointOffer) => pointOffer.title === offer.title);

      return `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="${offerUid}" type="checkbox" name="${offerUid}" ${isOfferChecked ? 'checked' : ''} ${isDisabled ? FormControlState.DISABLED : ''}>
        <label class="event__offer-label" for="${offerUid}">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>`;
    }).join('');
  };

  return `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

    <div class="event__available-offers">
      ${createPointAddOffersListTemplate(availablePointOffers)}
    </div>
  </section>`;
};

const createPointEditTemplate = (point = {}, availablePointOffers, destinations, isEditMode) => {
  const {
    basePrice,
    dateFrom,
    dateTo,
    destination,
    type,
    offers,
    isDisabled,
    isSaving,
    isDeleting,
  } = point;

  const rollUpButton = `<button class="event__rollup-btn" type="button">
    <span class="visually-hidden">Open event</span>
  </button>`;

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

              ${createPointEditTypesTemplate(type, isDisabled)}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination ? destination.name : ''}" list="destination-list-1" required ${isDisabled ? FormControlState.DISABLED : ''}>
          <datalist id="destination-list-1">
            ${createPointEditDestinationListTemplate(destinations)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formatDate(dateFrom, 'DD/MM/YY HH:mm')}" ${isDisabled ? FormControlState.DISABLED : ''}>
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formatDate(dateTo, 'DD/MM/YY HH:mm')}" ${isDisabled ? FormControlState.DISABLED : ''}>
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" min="0" value="${basePrice}" required>
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? FormControlState.DISABLED : ''}>
          ${isSaving ? 'Saving...' : 'Save'}
        </button>
        <button class="event__reset-btn" type="reset" ${isDisabled ? FormControlState.DISABLED : ''}>
          ${isEditMode ? (isEditMode && isDeleting ? 'Deleting...' : 'Delete') : 'Cancel'}
        </button>
        ${isEditMode ? rollUpButton : ''}
      </header>
      <section class="event__details">
        ${createPointEditOffersTemplate(availablePointOffers, offers, isDisabled)}

        ${createPointEditDestinationSectionTemplate(destination)}
      </section>
    </form>
  </li>`;
};

export default class PointEdit extends SmartView {
  constructor(offers, destinations, point = null) {
    super();
    this._data = PointEdit.parsePointToData(point || BLANK_POINT);
    this._isEditMode = point !== null;
    this._offers = offers;
    this._destinations = destinations;
    this._dateFromPicker = null;
    this._dateToPicker = null;
    this._dateState = null;
    this._availablePointOffers = [];

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formCancelClickHandler = this._formCancelClickHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);
    this._closeEditClickHandler = this._closeEditClickHandler.bind(this);
    this._eventTypeChangeHandler = this._eventTypeChangeHandler.bind(this);
    this._offerChangeHandler = this._offerChangeHandler.bind(this);
    this._eventDestinationChangeHandler = this._eventDestinationChangeHandler.bind(this);
    this._dateFromChangeHandler = this._dateFromChangeHandler.bind(this);
    this._dateToChangeHandler = this._dateToChangeHandler.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);

    this._setAvailablePointOffers(this._data.type);
    this._setInnerHandlers();
    this._initDateFromInstance();
    this._initDateToInstance();
  }

  getTemplate() {
    return createPointEditTemplate(this._data, this._availablePointOffers, this._destinations, this._isEditMode);
  }

  removeElement() {
    super.removeElement();

    if (this._dateFromPicker && this._dateToPicker) {
      this._dateFromPicker.destroy();
      this._dateFromPicker = null;
      this._dateToPicker.destroy();
      this._dateToPicker = null;
    }
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._initDateFromInstance();
    this._initDateToInstance();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setCloseEditClickHandler(this._callback.closeEditClick);
    this.setCancelClickHandler(this._callback.cancelClick);
    this.setDeleteClickHandler(this._callback.deleteClick);
  }

  _setAvailablePointOffers(type) {
    const availablePointOffer = this._offers.find((item) => item.type === type);

    if (availablePointOffer) {
      this._availablePointOffers = availablePointOffer.offers;
    }
  }

  _getDatepickerInstance(element, date, callback) {
    return flatpickr(
      this.getElement().querySelector(element),
      {
        enableTime: true,
        'time_24hr': true,
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

    this._dateFromPicker = this._getDatepickerInstance('#event-start-time-1', this._data.dateFrom, this._dateFromChangeHandler);
  }

  _initDateToInstance() {
    if (this._dateToPicker) {
      this._dateToPicker.destroy();
      this._dateToPicker = null;
    }

    this._dateToPicker = this._getDatepickerInstance('#event-end-time-1', this._data.dateTo, this._dateToChangeHandler);
  }

  _setInnerHandlers() {
    this.getElement().querySelector('.event__type-group').addEventListener(Evt.CHANGE, this._eventTypeChangeHandler);
    this.getElement().querySelector('.event__input--destination').addEventListener(Evt.CHANGE, this._eventDestinationChangeHandler);
    this.getElement().querySelector('.event__input--price').addEventListener(Evt.CHANGE, this._priceChangeHandler);

    const availableOffersElement = this.getElement().querySelector('.event__available-offers');

    if (availableOffersElement) {
      availableOffersElement.addEventListener(Evt.CHANGE, this._offerChangeHandler);
    }
  }

  _eventTypeChangeHandler(evt) {
    evt.preventDefault();

    const type = evt.target.value;

    this._setAvailablePointOffers(type);

    this.updateData({
      type,
    });
  }

  _offerChangeHandler(evt) {
    evt.preventDefault();

    const offerUid = evt.target.id;
    const targetOfferIndex = this._data.offers.findIndex((item) => getOfferUid(item) === offerUid);
    const pointOffers = this._data.offers.slice();

    if (this._data.offers.some((pointOffer) => getOfferUid(pointOffer) === offerUid)) {
      pointOffers.splice(targetOfferIndex, 1);

      this.updateData({
        offers: pointOffers,
      });
    } else {
      pointOffers.push(this._availablePointOffers.find((item) => getOfferUid(item) === offerUid));

      this.updateData({
        offers: pointOffers,
      });
    }
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
    this.updateData(
      {
        dateFrom: userDate,
      },
      true,
    );

    this._dateToPicker.set('minDate', userDate);

    if (this._dateState <= userDate || !this._dateState) {
      this._dateToPicker.setDate(userDate);
      this._dateState = userDate;

      this.updateData(
        {
          dateTo: userDate,
        },
        true,
      );
    }
  }

  _dateToChangeHandler([userDate]) {
    this._dateState = userDate;

    this.updateData(
      {
        dateTo: userDate,
      },
      true,
    );

    this._dateFromPicker.set('maxDate', userDate);
  }

  _priceChangeHandler(evt) {
    this.updateData({
      basePrice: parseInt(evt.target.value),
    }, true);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(PointEdit.parseDataToPoint(this._data));
  }

  _closeEditClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeEditClick();
  }

  _formCancelClickHandler(evt) {
    evt.preventDefault();
    this._callback.cancelClick();
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(PointEdit.parseDataToPoint(this._data));
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector('form').addEventListener(Evt.SUBMIT, this._formSubmitHandler);
  }

  setCancelClickHandler(callback) {
    if (this._isEditMode) {
      return;
    }

    this._callback.cancelClick = callback;
    this.getElement().querySelector('.event__reset-btn').addEventListener(Evt.CLICK, this._formCancelClickHandler);
  }

  setDeleteClickHandler(callback) {
    if (!this._isEditMode) {
      return;
    }

    this._callback.deleteClick = callback;
    this.getElement().querySelector('.event__reset-btn').addEventListener(Evt.CLICK, this._formDeleteClickHandler);
  }

  setCloseEditClickHandler(callback) {
    if (!this._isEditMode) {
      return;
    }

    this._callback.closeEditClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener(Evt.CLICK, this._closeEditClickHandler);
  }

  static parsePointToData(point) {
    return Object.assign(
      {},
      point,
      {
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      },
    );
  }

  static parseDataToPoint(data) {
    data = Object.assign({}, data);

    delete data.isDisabled;
    delete data.isSaving;
    delete data.isDeleting;
    return data;
  }
}
