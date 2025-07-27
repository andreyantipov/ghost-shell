export const SHELL_ID = 'SHELL' as const;

export enum ShellState {
  IDLE = 'idle',
  RUNNING = 'running',
}

export enum ShellEvent {
  ADD_PANEL = 'ADD_PANEL',
  REMOVE_PANEL = 'REMOVE_PANEL',
  UPDATE_PANEL = 'UPDATE_PANEL',
  IDLE = 'IDLE',
}

export enum ShellAction {
  ADD_PANEL = 'ADD_PANEL',
  REMOVE_PANEL = 'REMOVE_PANEL',
  IDLE = 'IDLE',
}