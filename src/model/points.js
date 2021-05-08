import Observer from '../utils/observer';
import {generateOffers, generateDestinations} from '../mock/point';

export default class Points extends Observer {
  constructor() {
    super();
    this._points = [];
    this._offers = generateOffers();
    this._destinations = generateDestinations();
  }

  getOffers() {
    return this._offers;
  }

  getDestinations() {
    return this._destinations;
  }

  setPoints(points) {
    this._points = points.slice();
  }

  getPoints() {
    return this._points;
  }

  updatePoint(updateType, updatedItem) {
    const index = this._points.findIndex((item) => item.id === updatedItem.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this._points = [
      ...this._points.slice(0, index),
      updatedItem,
      ...this._points.slice(index + 1),
    ];

    this._notify(updateType, updatedItem);
  }

  addPoint(updateType, updatedItem) {
    this._points = [
      updatedItem,
      ...this._points,
    ];

    this._notify(updateType, updatedItem);
  }

  deletePoint(updateType, updatedItem) {
    const index = this._points.findIndex((point) => point.id === updatedItem.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this._points = [
      ...this._points.slice(0, index),
      ...this._points.slice(index + 1),
    ];

    this._notify(updateType);
  }
}
