import SiteTabsView from './view/trip-tabs';
import TripInfoView from './view/trip-info';
import FilterView from './view/filter';
import TripSectionView from './view/trip-section';
import SortView from './view/sort';
import PointListView from './view/point-list';
import PointEditView from './view/point-edit';
import PointView from './view/point';
import NoPointView from './view/no-point';
import {RenderPlace, Evt, render} from './utils';
import {generatePoint, generateOffers, pointDestinationNames} from './mock/point';

const POINT_COUNT = 20;

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

const renderPoint = (pointListElement, point) => {
  const pointComponentElement = new PointView(point).getElement();
  const pointEditComponentElement = new PointEditView(point, generateOffers(), pointDestinationNames).getElement();

  const replaceCardToForm = () => {
    pointListElement.replaceChild(pointEditComponentElement, pointComponentElement);
  };

  const replaceFormToCard = () => {
    pointListElement.replaceChild(pointComponentElement, pointEditComponentElement);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key == 'Esc') {
      evt.preventDefault();
      replaceFormToCard();
      document.removeEventListener(Evt.KEYDOWN, onEscKeyDown);
    }
  };

  const rollupBtnClass = '.event__rollup-btn';

  const closePointEditCard = (evt) => {
    evt.preventDefault();
    replaceFormToCard();
    document.removeEventListener(Evt.KEYDOWN, onEscKeyDown);
  };

  pointComponentElement.querySelector(rollupBtnClass).addEventListener(Evt.CLICK, () => {
    replaceCardToForm();
    document.addEventListener(Evt.KEYDOWN, onEscKeyDown);
  });

  pointEditComponentElement.querySelector(rollupBtnClass).addEventListener(Evt.CLICK, (evt) => closePointEditCard(evt));

  pointEditComponentElement.querySelector('form').addEventListener(Evt.SUBMIT, (evt) => closePointEditCard(evt));

  render(pointListElement, pointComponentElement);
};

const renderTripSection = (tripSectionContainer, tripSectionPoints) => {
  const tripSectionComponentElement = new TripSectionView().getElement();
  const pointListComponent = new PointListView();

  render(tripSectionContainer, tripSectionComponentElement);
  render(tripSectionComponentElement, pointListComponent.getElement());

  if (tripSectionPoints.length === 0) {
    render(tripSectionComponentElement, new NoPointView().getElement());
    return;
  }

  render(tripSectionComponentElement, new SortView().getElement());

  for (let i = 1; i < POINT_COUNT; i++) {
    renderPoint(pointListComponent.getElement(), tripSectionPoints[i]);
  }
};

renderTripSection(pageBodyContainerElement, points);
