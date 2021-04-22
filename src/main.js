import SiteTabsView from './view/site-tabs';
import TripInfoView from './view/trip-info';
import FilterView from './view/filter';
import {RenderPlace, render} from './utils/render';
import {generatePoint} from './mock/point';
import TripPresenter from './presenter/trip';

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

const tripPresenter = new TripPresenter(pageBodyContainerElement);

tripPresenter.init(points);
