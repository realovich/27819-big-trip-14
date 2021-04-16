import {createElement} from '../utils';

const createTripSectionTemplate = () => {
  return `<section class="trip-events">
    <h2 class="visually-hidden">Trip events</h2>

  </section>`;
};

export default class TripSection {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createTripSectionTemplate();
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
