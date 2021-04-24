import Abstract from './abstract';

export default class Smart extends Abstract {
  constructor() {
    super();
    this._data = {};
  }

  updateData(updatedData, justDataUpdating) {
    if (!updatedData) {
      return;
    }

    this._data = Object.assign({}, this._data, updatedData);

    if (justDataUpdating) {
      return;
    }

    this.restoreHandlers();
    this.updateElement();
  }

  updateElement() {
    const prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement.parentElement;

    const newElement = this.getElement();

    parent.replaceChild(newElement, prevElement);
  }

  restoreHandlers() {
    throw new Error('Abstract method not implemented: resetHandlers');
  }
}
