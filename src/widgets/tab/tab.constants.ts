export const TAB_ID = 'TAB' as const;

export enum TabState {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  CLOSED = 'closed',
}

export enum TabEvent {
  ACTIVATE = 'ACTIVATE',
  DEACTIVATE = 'DEACTIVATE',
  CLOSE = 'CLOSE',
}

export enum TabAction {
  ACTIVATE = 'ACTIVATE',
  DEACTIVATE = 'DEACTIVATE',
  CLOSE = 'CLOSE',
}