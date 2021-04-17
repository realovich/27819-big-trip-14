import SiteTabsView from './view/site-tabs';
import TripInfoView from './view/trip-info';
import FilterView from './view/filter';
import TripSectionView from './view/trip-section';
import SortView from './view/sort';
import PointListView from './view/point-list';
import PointEditView from './view/point-edit';
import PointView from './view/point';
import NoPointView from './view/no-point';
import {RenderPlace, render, replace} from './utils/render';
import {Key, Evt} from './utils/common';
import {generatePoint, generateOffers, pointDestinationNames} from './mock/point';

const POINT_COUNT = 20;

const points = new Array(POINT_COUNT).fill().map(generatePoint);

const pageMainElement = document.querySelector('.page-main');
const pageHeaderElement = document.querySelector('.page-header');
const tripNavigationElement = pageHeaderElement.querySelector('.trip-controls__navigation');
const tripMainElement = pageHeaderElement.querySelector('.trip-main');
const tripFiltersELement = pageHeaderElement.querySelector('.trip-controls__filters');

render(tripNavigationElement, new SiteTabsView());
render(tripMainElement, new TripInfoView(points), RenderPlace.AFTERBEGIN);
render(tripFiltersELement, new FilterView());

const pageBodyContainerElement = pageMainElement.querySelector('.page-body__container');

const renderPoint = (pointListElement, point) => {
  const pointComponent = new PointView(point);
  const pointEditComponent = new PointEditView(point, generateOffers(), pointDestinationNames);

  const replaceCardToForm = () => {
    replace(pointEditComponent, pointComponent);
  };

  const replaceFormToCard = () => {
    replace(pointComponent, pointEditComponent);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === Key.ESCAPE || evt.key == Key.ESC) {
      evt.preventDefault();
      replaceFormToCard();
      document.removeEventListener(Evt.KEYDOWN, onEscKeyDown);
    }
  };

  const closePointEditCard = () => {
    replaceFormToCard();
    document.removeEventListener(Evt.KEYDOWN, onEscKeyDown);
  };

  pointComponent.setEditClickHandler(() => {
    replaceCardToForm();
    document.addEventListener(Evt.KEYDOWN, onEscKeyDown);
  });

  pointEditComponent.setCloseEditClickHandler(() => closePointEditCard());
  pointEditComponent.setFormSubmitHandler(() => closePointEditCard());

  render(pointListElement, pointComponent);
};

const renderTripSection = (tripSectionContainer, tripSectionPoints) => {
  const tripSectionComponent = new  TripSectionView();

  render(tripSectionContainer, tripSectionComponent);

  if (tripSectionPoints.length === 0) {
    render(tripSectionComponent, new NoPointView());
    return;
  }

  const pointListComponent = new PointListView();

  render(tripSectionComponent, new SortView());
  render(tripSectionComponent, pointListComponent);

  for (let i = 1; i < POINT_COUNT; i++) {
    renderPoint(pointListComponent, tripSectionPoints[i]);
  }
};

renderTripSection(pageBodyContainerElement, points);
