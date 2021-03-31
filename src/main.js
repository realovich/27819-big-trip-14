import {createTripTabsTemplate} from './view/trip-tabs';
import {createTripInfoTemplate} from './view/trip-info';
import {createTripFiltersTemplate} from './view/trip-filters';
import {createTripEventsTemplate} from './view/trip-events';
import {createPointAddTemplate} from './view/point-add';
import {createPointEditTemplate} from './view/point-edit';
import {createPointTemplate} from './view/point';

const POINT_COUNT = 3;

const Place = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};

const render = (container, template, position) => {
  container.insertAdjacentHTML(position, template);
};

const pageHeaderElement = document.querySelector('.page-header');
const tripNavigationElement = pageHeaderElement.querySelector('.trip-controls__navigation');
const tripMainElement = pageHeaderElement.querySelector('.trip-main');
const tripFiltersELement = pageHeaderElement.querySelector('.trip-controls__filters');

render(tripNavigationElement, createTripTabsTemplate(), Place.BEFOREEND);
render(tripMainElement, createTripInfoTemplate(), Place.AFTERBEGIN);
render(tripFiltersELement, createTripFiltersTemplate(), Place.BEFOREEND);

const tripEventsElement = document.querySelector('.trip-events');

render(tripEventsElement, createTripEventsTemplate(), Place.BEFOREEND);

const tripEventsListElement = tripEventsElement.querySelector('.trip-events__list');

render(tripEventsListElement, createPointEditTemplate(), Place.BEFOREEND);
render(tripEventsListElement, createPointAddTemplate(), Place.BEFOREEND);

const getPoints = (count) => {
  const points = [];

  for (let i = 0; i < count; i++) {
    points.push(createPointTemplate());
  }

  return points;
};

getPoints(POINT_COUNT).forEach((point) => {
  render(tripEventsListElement, point, Place.BEFOREEND);
});
