import PointView from '../view/point';
import PointEditView from '../view/point-edit';
import {render, replace, remove} from '../utils/render';
import {Key, Evt} from '../utils/common';
import {generateOffers, generateDestinations} from '../mock/point';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class Point {
  constructor(pointListContainer, changeData, changeMode) {
    this._pointListContainer = pointListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._pointComponent = null;
    this._pointEditComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleCloseEditClick = this._handleCloseEditClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(point) {
    this._point = point;

    const prevPointComponent = this._pointComponent;
    const prevPointEditComponent = this._pointEditComponent;

    this._pointComponent = new PointView(point);
    this._pointEditComponent = new PointEditView(point, generateOffers(), generateDestinations());

    this._pointComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._pointComponent.setEditClickHandler(this._handleEditClick);
    this._pointEditComponent.setCloseEditClickHandler(this._handleCloseEditClick);
    this._pointEditComponent.setFormSubmitHandler(this._handleFormSubmit);

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this._pointListContainer, this._pointComponent);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._pointComponent, prevPointComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._pointEditComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToCard();
    }
  }

  _replaceCardToForm() {
    replace(this._pointEditComponent, this._pointComponent);
    document.addEventListener(Evt.KEYDOWN, this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceFormToCard() {
    replace(this._pointComponent, this._pointEditComponent);
    document.removeEventListener(Evt.KEYDOWN, this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _escKeyDownHandler(evt) {
    if (evt.key === Key.ESCAPE || evt.key == Key.ESC) {
      evt.preventDefault();
      this._replaceFormToCard();
    }
  }

  _handleFavoriteClick() {
    this._changeData(
      Object.assign(
        {},
        this._point,
        {is_favorite: !this._point.is_favorite},
      ),
    );
  }

  _handleEditClick() {
    this._replaceCardToForm();
  }

  _handleCloseEditClick() {
    this._replaceFormToCard();
  }

  _handleFormSubmit(point) {
    this._changeData(point);
    this._replaceFormToCard();
  }
}
