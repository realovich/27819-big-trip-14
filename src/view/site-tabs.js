import AbstractView from './abstract';

const createSiteTabsTemplate = () => {
  return `<nav class="trip-controls__trip-tabs  trip-tabs">
    <a class="trip-tabs__btn  trip-tabs__btn--active" href="#">Table</a>
    <a class="trip-tabs__btn" href="#">Stats</a>
  </nav>`;
};

export default class SiteTabs extends AbstractView {
  getTemplate() {
    return createSiteTabsTemplate();
  }
}
