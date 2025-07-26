import { TabEvent } from './tab.constants';

export type TabEventObject =
  | { type: TabEvent.ACTIVATE }
  | { type: TabEvent.DEACTIVATE }
  | { type: TabEvent.CLOSE };

export interface TabContext {
  id: string;
  title: string;
}