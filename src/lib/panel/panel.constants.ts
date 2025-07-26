export const PANEL_ID = 'PANEL' as const;

export enum PanelState {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum PanelEvent {
  ADD_TAB = 'ADD_TAB',
  REMOVE_TAB = 'REMOVE_TAB',
  ACTIVATE_TAB = 'ACTIVATE_TAB',
}

export enum PanelAction {
  ADD_TAB = 'ADD_TAB',
  REMOVE_TAB = 'REMOVE_TAB',
  ACTIVATE_TAB = 'ACTIVATE_TAB',
}