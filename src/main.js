import TripTabsView from './view/trip-tabs';
import StatisticsView from './view/statistics';
import {render, remove} from './utils/render';
import {generatePoint, generateOffers, generateDestinations} from './mock/point';
import TripPresenter from './presenter/trip';
import FilterPresenter from './presenter/filter';
import TripInfoPresenter from './presenter/trip-info';
import PointsModel from './model/points';
import FilterModel from './model/filter';
import { Evt, MenuItem } from './utils/common';

const POINT_COUNT = 20;

const points = new Array(POINT_COUNT).fill().map(generatePoint);
const offers = generateOffers();
const destinations = generateDestinations();

const pageMainElement = document.querySelector('.page-main');
const pageHeaderElement = document.querySelector('.page-header');
const tripNavigationElement = pageHeaderElement.querySelector('.trip-controls__navigation');
const tripMainElement = pageHeaderElement.querySelector('.trip-main');
const tripFiltersELement = pageHeaderElement.querySelector('.trip-controls__filters');

const pointsModel = new PointsModel();
pointsModel.setPoints(points);
pointsModel.setOffers(offers);
pointsModel.setDestinations(destinations);

const filterModel = new FilterModel();

const tripTabsComponent = new TripTabsView();
render(tripNavigationElement, tripTabsComponent);

const pageBodyContainerElement = pageMainElement.querySelector('.page-body__container');

const tripInfoPresenter = new TripInfoPresenter(tripMainElement, pointsModel);
const filterPresenter = new FilterPresenter(tripFiltersELement, filterModel);
const tripPresenter = new TripPresenter(pageBodyContainerElement, pointsModel, filterModel);

let statisticsComponent = null;

const handleTripTabsClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      remove(statisticsComponent);
      tripTabsComponent.setMenuItem(MenuItem.TABLE);
      tripPresenter.init();
      break;
    case MenuItem.STATS:
      tripPresenter.destroy();
      tripTabsComponent.setMenuItem(MenuItem.STATS);
      statisticsComponent = new StatisticsView(pointsModel.getPoints());
      render(pageBodyContainerElement, statisticsComponent);
      break;
  }
};

tripTabsComponent.setMenuClickHandler(handleTripTabsClick);

tripInfoPresenter.init();
filterPresenter.init();
tripPresenter.init();

document.querySelector('.trip-main__event-add-btn').addEventListener(Evt.CLICK, (evt) => {
  evt.preventDefault();
  tripPresenter.createTask();
});
