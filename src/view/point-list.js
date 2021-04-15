import {createElement} from '../utils';

const createPointListTemplate = () => {
  return '<ul class="trip-events__list"></ul>';
};

export default class PointList {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createPointListTemplate();
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
