import TripSectionView from '../view/trip-section';
import SortView from '../view/sort';
import PointListView from '../view/point-list';
import NoPointView from '../view/no-point';
import {render} from '../utils/render';
import {updateItem} from '../utils/common.js';
import {SortType, sortPointDay, sortPointPrice, sortPointTime} from '../utils/point';
import PointPresenter from './point';

const POINT_COUNT = 20;

export default class Trip {
  constructor (tripSectionContainer) {
    this._tripSectionContainer = tripSectionContainer;
    this._pointPresenter = {};
    this._currentSortType = SortType.DAY;

    this._tripSectionComponent = new TripSectionView();
    this._sortComponent = new SortView();
    this._pointListComponent = new PointListView();
    this._noPointComponent = new NoPointView();

    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(tripPoints) {
    this._tripPoints = tripPoints.slice();
    this._sourcedTripPoints = tripPoints.slice();

    render(this._tripSectionContainer, this._tripSectionComponent);
    render(this._tripSectionComponent, this._pointListComponent);

    this._renderTripSection();
  }

  _handleModeChange() {
    Object.values(this._pointPresenter).forEach((presenter) => presenter.resetView());
  }

  _handlePointChange(updatedPoint) {
    this._tripPoints = updateItem(this._tripPoints, updatedPoint);
    this._sourcedTripPoints = updateItem(this._sourcedTripPoints, updatedPoint);
    this._pointPresenter[updatedPoint.id].init(updatedPoint);
  }

  _getSortedPoints(sortType) {
    switch (sortType) {
      case SortType.PRICE:
        return this._tripPoints.sort(sortPointPrice);
      case SortType.TIME:
        return this._tripPoints.sort(sortPointTime);
      default:
        return this._tripPoints.sort(sortPointDay);
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearPointList();
    this._renderPointList();
  }

  _renderSort() {
    render(this._tripSectionComponent, this._sortComponent);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._pointListComponent, this._handlePointChange, this._handleModeChange);
    pointPresenter.init(point);
    this._pointPresenter[point.id] = pointPresenter;
  }

  _renderPoints() {
    const sortedPoints = this._getSortedPoints(this._currentSortType);

    for (let i = 0; i < POINT_COUNT; i++) {
      this._renderPoint(sortedPoints[i]);
    }
  }

  _renderNoPoints() {
    render(this._tripSectionComponent, this._noPointComponent);
  }

  _clearPointList() {
    Object.values(this._pointPresenter).forEach((presenter) => presenter.destroy());

    this._pointPresenter = {};
  }

  _renderPointList() {
    render(this._tripSectionComponent, this._pointListComponent);
    this._renderPoints();
  }

  _renderTripSection() {
    if (this._tripPoints.length === 0) {
      this._renderNoPoints();
      return;
    }

    this._renderSort();
    this._renderPointList();
  }
}
