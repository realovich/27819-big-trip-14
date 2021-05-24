import TripTabsView from './view/trip-tabs';
import StatisticsView from './view/statistics';
import {render, remove} from './utils/render';
import TripPresenter from './presenter/trip';
import FilterPresenter from './presenter/filter';
import TripInfoPresenter from './presenter/trip-info';
import PointsModel from './model/points';
import FilterModel from './model/filter';
import { Evt, MenuItem, UpdateType } from './utils/common';
import Api from './api';

const AUTHORIZATION = 'Basic re15ch21viTo40';
const END_POITN = 'https://14.ecmascript.pages.academy/big-trip/';

const api = new Api(END_POITN, AUTHORIZATION);

const pageMainElement = document.querySelector('.page-main');
const pageHeaderElement = document.querySelector('.page-header');
const tripNavigationElement = pageHeaderElement.querySelector('.trip-controls__navigation');
const tripMainElement = pageHeaderElement.querySelector('.trip-main');
const tripFiltersELement = pageHeaderElement.querySelector('.trip-controls__filters');
const pageBodyContainerElement = pageMainElement.querySelector('.page-body__container');

const pointsModel = new PointsModel();
const filterModel = new FilterModel();

const tripTabsComponent = new TripTabsView();

const tripInfoPresenter = new TripInfoPresenter(tripMainElement, pointsModel);
const filterPresenter = new FilterPresenter(tripFiltersELement, filterModel);
const tripPresenter = new TripPresenter(pageBodyContainerElement, pointsModel, filterModel, api);

let statisticsComponent = null;

const handleTripTabsClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      remove(statisticsComponent);
      tripTabsComponent.setMenuItem(MenuItem.TABLE);
      tripPresenter.init();
      enablePointAddButton();
      filterPresenter.enable();
      break;
    case MenuItem.STATS:
      tripPresenter.destroy();
      tripTabsComponent.setMenuItem(MenuItem.STATS);
      statisticsComponent = new StatisticsView(pointsModel.getPoints());
      render(pageBodyContainerElement, statisticsComponent);
      disablePointAddButton();
      filterPresenter.disable();
      break;
  }
};

tripPresenter.init();

const pointAddButton = pageHeaderElement.querySelector('.trip-main__event-add-btn');

const disablePointAddButton = () => pointAddButton.setAttribute('disabled', 'disabled');
const enablePointAddButton = () => pointAddButton.removeAttribute('disabled');

const pointAddClickHandler = (evt) => {
  evt.preventDefault();
  tripPresenter.createPoint(enablePointAddButton);
  disablePointAddButton();
};

pointAddButton.addEventListener(Evt.CLICK, pointAddClickHandler);

Promise.all([api.getDestinations(), api.getOffers(), api.getPoints()])
  .then(([destinations, offers, points]) => {
    pointsModel.setDestinations(destinations);
    pointsModel.setOffers(offers);
    pointsModel.setPoints(points, UpdateType.INIT);

    render(tripNavigationElement, tripTabsComponent);
    tripTabsComponent.setMenuClickHandler(handleTripTabsClick);
    tripInfoPresenter.init();
    filterPresenter.init();
  })
  .catch(() => {
    pointsModel.setPoints([], UpdateType.INIT);
  });
