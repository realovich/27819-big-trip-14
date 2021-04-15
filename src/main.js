import SiteTabsView from './view/trip-tabs';
import TripInfoView from './view/trip-info';
import FilterView from './view/filter';
import TripEventsView from './view/trip-events';
import SortView from './view/sort';
import PointListView from './view/point-list';
import PointEditView from './view/point-edit';
import PointView from './view/point';
import {RenderPlace, render} from './utils';
import {generatePoint, generateOffers, pointDestinationNames} from './mock/point';

const POINT_COUNT = 16;

const points = new Array(POINT_COUNT).fill().map(generatePoint);

const pageMainElement = document.querySelector('.page-main');
const pageHeaderElement = document.querySelector('.page-header');
const tripNavigationElement = pageHeaderElement.querySelector('.trip-controls__navigation');
const tripMainElement = pageHeaderElement.querySelector('.trip-main');
const tripFiltersELement = pageHeaderElement.querySelector('.trip-controls__filters');

render(tripNavigationElement, new SiteTabsView().getElement());
render(tripMainElement, new TripInfoView(points).getElement(), RenderPlace.AFTERBEGIN);
render(tripFiltersELement, new FilterView().getElement());

const pageBodyContainerElement = pageMainElement.querySelector('.page-body__container');

const tripEventsComponent = new TripEventsView();

render(pageBodyContainerElement, tripEventsComponent.getElement());
render(tripEventsComponent.getElement(), new SortView().getElement());

const pointListComponent = new PointListView();
render(tripEventsComponent.getElement(), pointListComponent.getElement());

const renderPoint = (pointListElement, point) => {
  const pointComponentElement = new PointView(point).getElement();
  const pointEditComponentElement = new PointEditView(point, generateOffers(), pointDestinationNames).getElement();

  const replaceCardToForm = () => {
    pointListElement.replaceChild(pointEditComponentElement, pointComponentElement);
  };

  const replaceFormToCard = () => {
    pointListElement.replaceChild(pointComponentElement, pointEditComponentElement);
  };

  pointComponentElement.querySelector('.event__rollup-btn').addEventListener('click', () => {
    replaceCardToForm();
  });

  pointEditComponentElement.querySelector('form').addEventListener('submit', (evt) => {
    evt.preventDefault();
    replaceFormToCard();
  });

  render(pointListElement, pointComponentElement);
};

for (let i = 1; i < POINT_COUNT; i++) {
  renderPoint(pointListComponent.getElement(), points[i]);
}
