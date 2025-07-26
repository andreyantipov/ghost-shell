import { ShellEvent } from './shell.constants';

export type ShellEventObject =
  | { type: ShellEvent.IDLE }
  | { type: ShellEvent.ADD_PANEL; panelId: string }
  | { type: ShellEvent.REMOVE_PANEL; panelId: string };

export interface ShellContext {
  panels: string[];
  panelActors: Record<string, any>;
}