import AbstractView from './abstract';
import {MenuItem, Evt} from '../utils/const';

const createSiteTabsTemplate = () => {
  return `<nav class="trip-controls__trip-tabs trip-tabs">
    <a class="trip-tabs__btn  trip-tabs__btn--active" data-item="${MenuItem.TABLE}" href="#">Table</a>
    <a class="trip-tabs__btn" data-item="${MenuItem.STATS}" href="#">Stats</a>
  </nav>`;
};

export default class SiteTabs extends AbstractView {
  constructor() {
    super();

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createSiteTabsTemplate();
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    this._callback.menuClick(evt.target.getAttribute('data-item'));
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener(Evt.CLICK, this._menuClickHandler);
  }

  setMenuItem(menuItem) {
    const itemClass = 'trip-tabs__btn';
    const itemActiveClass = itemClass + '--active';
    const items = this.getElement().querySelectorAll(`.${itemClass}`);

    items.forEach((item) => {
      if (item.getAttribute('data-item') === menuItem) {
        item.classList.add(itemActiveClass);
      } else {
        item.classList.remove(itemActiveClass);
      }
    });
  }
}
