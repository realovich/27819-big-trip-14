import AbstractView from './abstract';
import {Evt, FormControlState} from '../utils/const';

const createFilterTemplate = (filters, currentFilterType) => {

  return `<form class="trip-filters" action="#" method="get">
    ${filters.map(({type, name}) => `<div class="trip-filters__filter">
      <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}" ${type === currentFilterType ? FormControlState.CHECKED : ''}>
      <label class="trip-filters__filter-label" for="filter-${type}">${name}</label>
    </div>`).join('')}

    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`;
};

export default class Filter extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilterType = currentFilterType;
    this._filterInputs = this.getElement().querySelectorAll('input');

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFilterTemplate(this._filters, this._currentFilterType);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener(Evt.CHANGE, this._filterTypeChangeHandler);
  }

  disableFilter() {
    this._filterInputs.forEach((filterInput) => {
      filterInput.setAttribute('disabled', 'disabled');
    });
  }

  enableFilter() {
    this._filterInputs.forEach((filterInput) => {
      filterInput.removeAttribute('disabled');
    });
  }
}
