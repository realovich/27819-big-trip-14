import Observer from '../utils/observer';

export default class Points extends Observer {
  constructor() {
    super();
    this._points = [];
    this._offers = [];
    this._destinations = [];
  }

  setOffers(offers) {
    this._offers = offers;
  }

  getOffers() {
    return this._offers;
  }

  setDestinations(destinations) {
    this._destinations = destinations;
  }

  getDestinations() {
    return this._destinations;
  }

  setPoints(points, updateType) {
    this._points = points.slice();

    this._notify(updateType);
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
      ...this._points,
      updatedItem,
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

  static adaptToClient(point) {
    const adaptedPoint = Object.assign(
      {},
      point,
      {
        basePrice: point.base_price,
        dateFrom: new Date(point.date_from),
        dateTo: new Date(point.date_to),
        isFavorite: point.is_favorite,
      },
    );

    delete adaptedPoint.base_price;
    delete adaptedPoint.date_from;
    delete adaptedPoint.date_to;
    delete adaptedPoint.is_favorite;

    return adaptedPoint;
  }

  static adaptToServer(point) {
    const adaptedPoint = Object.assign(
      {},
      point,
      {
        'base_price': point.basePrice,
        'date_from': point.dateFrom.toISOString(),
        'date_to': point.dateTo.toISOString(),
        'is_favorite': point.isFavorite === undefined ? false : point.isFavorite,
      },
    );

    delete adaptedPoint.basePrice;
    delete adaptedPoint.dateFrom;
    delete adaptedPoint.dateTo;
    delete adaptedPoint.isFavorite;

    return adaptedPoint;
  }
}
