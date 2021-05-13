import AbstractView from './abstract';
import {Evt} from '../utils/common';

const sortData = [
  {inputName: 'sort-day', label: 'day'},
  {inputName: 'sort-event', label: 'event', isDisabled: true},
  {inputName: 'sort-time', label: 'time'},
  {inputName: 'sort-price', label: 'price'},
  {inputName: 'sort-offer', label: 'offer', isDisabled: true},
];

const createSortTemplate = (currentSortType) => {
  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${sortData.map(({label, inputName, isDisabled}) => `<div class="trip-sort__item  trip-sort__item--${label}">
      <input id="${inputName}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="${inputName}"${isDisabled ? ' disabled' : ''}${inputName === currentSortType ? ' checked' : ''}>
      <label class="trip-sort__btn" for="${inputName}">${label}</label>
    </div>`).join('')}
  </form>`;
};

export default class Sort extends AbstractView {
  constructor(currentSortType) {
    super();

    this._currentSortType = currentSortType;

    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortTemplate(this._currentSortType);
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== 'INPUT' || evt.target.hasAttribute('disabled')) {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.value);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener(Evt.CHANGE, this._sortTypeChangeHandler);
  }
}
