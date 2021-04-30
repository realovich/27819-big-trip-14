import AbstractView from './abstract';
import {Evt} from '../utils/common';
import {calculateDuration, formatDate} from '../utils/date';

const createOffersListTemplate = (offers) => {
  if (offers.length === 0) {
    return '';
  }

  return `<h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
      ${offers.map(({title, price}) => `<li class="event__offer">
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </li>`).join('')}
    </ul>`;
};

const createPointTemplate = (point) => {
  const {type, base_price, offers, date_from, date_to, destination, is_favorite} = point;

  const favoriteClassName = is_favorite ? ' event__favorite-btn--active' : '';

  return `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${formatDate(date_from, 'YYYY-MM-DD')}">${formatDate(date_from, 'MMM D')}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${destination.name}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${formatDate(date_from, 'YYYY-MM-DDTHH:mm')}">${formatDate(date_from, 'HH:mm')}</time>
          &mdash;
          <time class="event__end-time" datetime="${formatDate(date_to, 'YYYY-MM-DDTHH:mm')}">${formatDate(date_to, 'HH:mm')}</time>
        </p>
        <p class="event__duration">${calculateDuration(date_from, date_to)}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${base_price}</span>
      </p>
      ${createOffersListTemplate(offers)}
      <button class="event__favorite-btn${favoriteClassName}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`;
};

export default class Point extends AbstractView {
  constructor(point) {
    super();
    this._point = point;

    this._editClickHandler = this._editClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createPointTemplate(this._point);
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener(Evt.CLICK, this._editClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.event__favorite-btn').addEventListener(Evt.CLICK, this._favoriteClickHandler);
  }
}
