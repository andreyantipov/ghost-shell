import { StatusBarEvent } from './status-bar.constants';

export interface StatusBarItem {
  id: string;
  text: string;
  priority?: number;
  tooltip?: string;
  onClick?: () => void;
}

export type StatusBarEventObject =
  | { type: StatusBarEvent.UPDATE_STATUS; text: string }
  | { type: StatusBarEvent.ADD_ITEM; item: StatusBarItem }
  | { type: StatusBarEvent.REMOVE_ITEM; itemId: string }
  | { type: StatusBarEvent.CLEAR };

export interface StatusBarContext {
  status: string;
  items: StatusBarItem[];
}