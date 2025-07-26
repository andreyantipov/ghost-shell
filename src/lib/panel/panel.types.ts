import { PanelEvent } from './panel.constants';

export type PanelEventObject =
  | { type: PanelEvent.ADD_TAB; tabId: string; title?: string }
  | { type: PanelEvent.REMOVE_TAB; tabId: string }
  | { type: PanelEvent.ACTIVATE_TAB; tabId: string };

export interface PanelContext {
  tabs: string[];
  activeTab: string | null;
  tabActors: Record<string, any>;
}