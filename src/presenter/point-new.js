import PointEditView from '../view/point-edit';
import {render, remove, RenderPlace} from '../utils/render';
import {Key, Evt, UserAction, UpdateType} from '../utils/common';
import {nanoid} from 'nanoid';

export default class PointNew {
  constructor(pointListContainer, changeData) {
    this._pointListContainer = pointListContainer;
    this._changeData = changeData;

    this._pointEditComponent = null;

    this._handleCloseEditClick = this._handleCloseEditClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(offers, destinations) {
    if (this._pointEditComponent !== null) {
      return;
    }

    this._offers = offers;
    this._destinations = destinations;

    this._pointEditComponent = new PointEditView(null, this._offers, this._destinations);
    this._pointEditComponent.setCloseEditClickHandler(this._handleCloseEditClick);
    this._pointEditComponent.setFormSubmitHandler(this._handleFormSubmit);

    render(this._pointListContainer, this._pointEditComponent, RenderPlace.AFTERBEGIN);

    document.addEventListener(Evt.KEYDOWN, this._escKeyDownHandler);
  }

  destroy() {
    if (this._pointEditComponent === null) {
      return;
    }

    remove(this._pointEditComponent);

    this._pointEditComponent = null;
    document.removeEventListener(Evt.KEYDOWN, this._escKeyDownHandler);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === Key.ESCAPE || evt.key == Key.ESC) {
      evt.preventDefault();
      this.destroy();
    }
  }

  _handleCloseEditClick() {
    this.destroy();
  }

  _handleFormSubmit(point) {
    this._changeData(
      UserAction.ADD_POINT,
      UpdateType.MAJOR,
      Object.assign({id: nanoid()}, point),
    );
  }
}
