export const POINT_TYPES = ['taxi', 'bus', 'train', 'ship', 'transport', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

export const FormControlState = {
  DISABLED: 'disabled',
  CHECKED: 'checked',
};

export const Key = {
  ESC: 'Esc',
  ESCAPE: 'Escape',
};

export const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
  ABORTING: 'ABORTING',
};

export const Evt = {
  CLICK: 'click',
  KEYDOWN: 'keydown',
  SUBMIT: 'submit',
  CHANGE: 'change',
};

export const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

export const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};

export const MenuItem = {
  TABLE: 'table',
  STATS: 'stats',
};

export const RenderPlace = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};

export const ChartSetting = {
  TYPE: 'horizontalBar',
  COLOR: {
    WHITE: '#ffffff',
    BLACK: '#000000',
  },
  ANCHOR: {
    START: 'start',
    END: 'end',
  },
  ALIGN: 'start',
  TEXT: {
    MONEY: 'MONEY',
    TYPE: 'TYPE',
    TIME_SPEND: 'TIME SPEND',
  },
  TITLE_POSITION: 'left',
  TICKS_PADDING: 5,
  DATA_FONT_SIZE: 13,
  TITLE_FONT_SIZE: 23,
  TICKS_FONT_SIZE: 13,
  BAR_THICKNESS: 44,
  MIN_BAR_LENGTH: 50,
  BAR_HEIGHT: 55,
};
