import { ShellEvent, PanelEvent } from './constants';

export type ShellEventObject =
  | { type: ShellEvent.IDLE }
  | { type: ShellEvent.ADD_PANEL; panelId: string }
  | { type: ShellEvent.REMOVE_PANEL; panelId: string };

export interface ShellContext {
  panels: string[];
  panelActors: Record<string, any>;
}

export type PanelEventObject =
  | { type: PanelEvent.ADD_TAB; tabId: string; title?: string }
  | { type: PanelEvent.REMOVE_TAB; tabId: string }
  | { type: PanelEvent.ACTIVATE_TAB; tabId: string };

export interface PanelContext {
  tabs: string[];
  activeTab: string | null;
  tabActors: Record<string, any>;
}

export interface TabContext {
  id: string;
  title: string;
}
