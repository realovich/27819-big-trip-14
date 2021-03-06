import TripSectionView from '../view/trip-section';
import SortView from '../view/sort';
import PointListView from '../view/point-list';
import NoPointView from '../view/no-point';
import {filter} from '../utils/filter';
import {remove, render} from '../utils/render';
import {UpdateType, UserAction, FilterType} from '../utils/common.js';
import {SortType, sortPointDay, sortPointPrice, sortPointTime} from '../utils/point';
import PointPresenter from './point';
import PointNewPresenter from './point-new';

export default class Trip {
  constructor (tripSectionContainer, pointsModel, filterModel) {
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._tripSectionContainer = tripSectionContainer;
    this._pointPresenter = {};
    this._currentSortType = SortType.DAY;
    this._offers = this._pointsModel.getOffers();
    this._destinations = this._pointsModel.getDestinations();

    this._sortComponent = null;

    this._tripSectionComponent = new TripSectionView();
    this._pointListComponent = new PointListView();
    this._noPointComponent = new NoPointView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._pointNewPresenter = new PointNewPresenter(this._pointListComponent, this._handleViewAction);
  }

  init() {
    render(this._tripSectionContainer, this._tripSectionComponent);
    render(this._tripSectionComponent, this._pointListComponent);

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._renderTripSection();
  }

  destroy() {
    this._clearTripSection({resetSortType: true});

    remove(this._pointListComponent);
    remove(this._tripSectionComponent);

    this._pointsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  createTask() {
    this._currentSortType = SortType.DAY;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._pointNewPresenter.init(this._offers, this._destinations);
  }

  _getPoints() {
    const filterType = this._filterModel.getFilter();
    const points = this._pointsModel.getPoints();

    const getFilteredPoints = () => {
      if (filterType === FilterType.EVERYTHING) {
        return points;
      }

      return filter[filterType](points);
    };

    switch (this._currentSortType) {
      case SortType.PRICE:
        return getFilteredPoints().sort(sortPointPrice);
      case SortType.TIME:
        return getFilteredPoints().sort(sortPointTime);
    }
    return getFilteredPoints().sort(sortPointDay);
  }

  _handleModeChange() {
    this._pointNewPresenter.destroy();
    Object.values(this._pointPresenter).forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, updatedItem) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointsModel.updatePoint(updateType, updatedItem);
        break;
      case UserAction.ADD_POINT:
        this._pointsModel.addPoint(updateType, updatedItem);
        break;
      case UserAction.DELETE_POINT:
        this._pointsModel.deletePoint(updateType, updatedItem);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._pointPresenter[data.id].init(data,  this._offers, this._destinations);
        break;
      case UpdateType.MINOR:
        this._clearTripSection();
        this._renderTripSection();
        break;
      case UpdateType.MAJOR:
        this._clearTripSection({resetSortType: true});
        this._renderTripSection();
        break;
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearTripSection();
    this._renderTripSection();
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);

    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._tripSectionComponent, this._sortComponent);
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._pointListComponent, this._handleViewAction, this._handleModeChange);
    pointPresenter.init(point, this._offers, this._destinations);
    this._pointPresenter[point.id] = pointPresenter;
  }

  _renderPoints(points) {
    points.forEach((point) => this._renderPoint(point));
  }

  _renderNoPoints() {
    render(this._tripSectionComponent, this._noPointComponent);
  }

  _clearTripSection({resetSortType = false} = {}) {
    this._pointNewPresenter.destroy();

    Object.values(this._pointPresenter).forEach((presenter) => presenter.destroy());
    this._pointPresenter = {};

    remove(this._sortComponent);
    remove(this._noPointComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DAY;
    }
  }

  _renderTripSection() {
    const points = this._getPoints();
    const pointsCount = points.length;

    if (pointsCount === 0) {
      this._renderNoPoints();
      return;
    }

    this._renderSort();

    render(this._tripSectionComponent, this._pointListComponent);

    this._renderPoints(points);
  }
}
