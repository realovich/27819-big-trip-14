import PointEditView from '../view/point-edit';
import {render, remove} from '../utils/render';
import {Key, Evt, UserAction, UpdateType, RenderPlace} from '../utils/const';

export default class PointNew {
  constructor(pointListContainer, changeData) {
    this._pointListContainer = pointListContainer;
    this._changeData = changeData;

    this._pointEditComponent = null;

    this._handleCancelClick = this._handleCancelClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(offers, destinations, enablePointAddButton) {
    if (this._pointEditComponent !== null) {
      return;
    }

    this._offers = offers;
    this._destinations = destinations;
    this._enablePointAddButton = enablePointAddButton;

    this._pointEditComponent = new PointEditView(this._offers, this._destinations);
    this._pointEditComponent.setCancelClickHandler(this._handleCancelClick);
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

  setSaving() {
    this._pointEditComponent.updateData({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this._pointEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this._pointEditComponent.shake(resetFormState);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === Key.ESCAPE || evt.key === Key.ESC) {
      evt.preventDefault();
      this.destroy();
      this._enablePointAddButton();
    }
  }

  _handleCancelClick() {
    this.destroy();
    this._enablePointAddButton();
  }

  _handleFormSubmit(point) {
    this._changeData(
      UserAction.ADD_POINT,
      UpdateType.MAJOR,
      point,
    );
    this._enablePointAddButton();
  }
}
