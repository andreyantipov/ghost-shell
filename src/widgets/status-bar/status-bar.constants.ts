export const STATUS_BAR_ID = 'STATUS_BAR' as const;

export enum StatusBarState {
  IDLE = 'idle',
  UPDATING = 'updating',
}

export enum StatusBarEvent {
  UPDATE_STATUS = 'UPDATE_STATUS',
  ADD_ITEM = 'ADD_ITEM',
  REMOVE_ITEM = 'REMOVE_ITEM',
  CLEAR = 'CLEAR',
}

export enum StatusBarAction {
  UPDATE_STATUS = 'UPDATE_STATUS',
  ADD_ITEM = 'ADD_ITEM',
  REMOVE_ITEM = 'REMOVE_ITEM',
  CLEAR = 'CLEAR',
}