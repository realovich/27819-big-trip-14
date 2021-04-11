import {createTripTabsTemplate} from './view/trip-tabs';
import {createTripInfoTemplate} from './view/trip-info';
import {createTripFiltersTemplate} from './view/trip-filters';
import {createTripEventsTemplate} from './view/trip-events';
import {createPointEditTemplate} from './view/point-edit';
import {createPointTemplate} from './view/point';
import {generatePoint, generateOffers, generateDestination} from './mock/point';

const POINT_COUNT = 16;

const points = new Array(POINT_COUNT).fill().map(generatePoint);

const Place = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};

const render = (container, template, position = Place.BEFOREEND) => {
  container.insertAdjacentHTML(position, template);
};

const pageHeaderElement = document.querySelector('.page-header');
const tripNavigationElement = pageHeaderElement.querySelector('.trip-controls__navigation');
const tripMainElement = pageHeaderElement.querySelector('.trip-main');
const tripFiltersELement = pageHeaderElement.querySelector('.trip-controls__filters');

render(tripNavigationElement, createTripTabsTemplate());
render(tripMainElement, createTripInfoTemplate(), Place.AFTERBEGIN);
render(tripFiltersELement, createTripFiltersTemplate());

const tripEventsElement = document.querySelector('.trip-events');

render(tripEventsElement, createTripEventsTemplate());

const tripEventsListElement = tripEventsElement.querySelector('.trip-events__list');

render(tripEventsListElement, createPointEditTemplate(points[0], generateOffers(), generateDestination()), Place.AFTERBEGIN);

for (let i = 1; i < POINT_COUNT; i++) {
  render(tripEventsListElement, createPointTemplate(points[i], generateDestination()), Place.BEFOREEND);
}
