import TripSectionView from '../view/trip-section';
import SortView from '../view/sort';
import PointListView from '../view/point-list';
import NoPointView from '../view/no-point';
import {render} from '../utils/render';
import {updateItem} from '../utils/common.js';
import PointPresenter from './point';

const POINT_COUNT = 20;

export default class Trip {
  constructor (tripSectionContainer) {
    this._tripSectionContainer = tripSectionContainer;
    this._pointPresenter = {};

    this._tripSectionComponent = new TripSectionView();
    this._sortComponent = new SortView();
    this._pointListComponent = new PointListView();
    this._noPointComponent = new NoPointView();

    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }

  init(tripPoints) {
    this._tripPoints = tripPoints;

    render(this._tripSectionContainer, this._tripSectionComponent);
    render(this._tripSectionComponent, this._pointListComponent);

    this._renderTripSection();
  }

  _handleModeChange() {
    Object.values(this._pointPresenter).forEach((presenter) => presenter.resetView());
  }

  _handlePointChange(updatedPoint) {
    this._tripPoints = updateItem(this._tripPoints, updatedPoint);
    this._pointPresenter[updatedPoint.id].init(updatedPoint);
  }

  _renderSort() {
    render(this._tripSectionComponent, this._sortComponent);
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._pointListComponent, this._handlePointChange, this._handleModeChange);
    pointPresenter.init(point);
    this._pointPresenter[point.id] = pointPresenter;
  }

  _renderPoints() {
    for (let i = 1; i < POINT_COUNT; i++) {
      this._renderPoint(this._tripPoints[i]);
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
