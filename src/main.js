import SiteTabsView from './view/site-tabs';
import {render} from './utils/render';
import {generatePoint} from './mock/point';
import TripPresenter from './presenter/trip';
import FilterPresenter from './presenter/filter';
import TripInfoPresenter from './presenter/trip-info';
import PointsModel from './model/points';
import FilterModel from './model/filter';
import { Evt } from './utils/common';

const POINT_COUNT = 20;

const points = new Array(POINT_COUNT).fill().map(generatePoint);

const pageMainElement = document.querySelector('.page-main');
const pageHeaderElement = document.querySelector('.page-header');
const tripNavigationElement = pageHeaderElement.querySelector('.trip-controls__navigation');
const tripMainElement = pageHeaderElement.querySelector('.trip-main');
const tripFiltersELement = pageHeaderElement.querySelector('.trip-controls__filters');

const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const filterModel = new FilterModel();

render(tripNavigationElement, new SiteTabsView());

const pageBodyContainerElement = pageMainElement.querySelector('.page-body__container');

const tripInfoPresenter = new TripInfoPresenter(tripMainElement, pointsModel);
const filterPresenter = new FilterPresenter(tripFiltersELement, filterModel);
const tripPresenter = new TripPresenter(pageBodyContainerElement, pointsModel, filterModel);

tripInfoPresenter.init();
filterPresenter.init();
tripPresenter.init();

document.querySelector('.trip-main__event-add-btn').addEventListener(Evt.CLICK, (evt) => {
  evt.preventDefault();
  tripPresenter.createTask();
});
