import AbstractView from './abstract';

const createTripSectionTemplate = () => {
  return `<section class="trip-events">
    <h2 class="visually-hidden">Trip events</h2>

  </section>`;
};

export default class TripSection extends AbstractView {
  getTemplate() {
    return createTripSectionTemplate();
  }
}
