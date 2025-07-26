import { createMachine, assign } from 'xstate';
import { SHELL_ID, ShellEvent, ShellState, ShellAction } from './shell.constants';
import type { ShellContext, ShellEventObject } from './shell.types';
import { panelMachine } from '../panel/panel.machine';

export const shellMachine = createMachine({
  types: {} as {
    context: ShellContext;
    events: ShellEventObject;
  },
  id: SHELL_ID,
  initial: ShellState.IDLE,
  context: {
    panels: [], // panel ids
    panelActors: {} as Record<string, any>, // panelId -> actor
  },
  states: {
    [ShellState.IDLE]: {
      on: {
        [ShellEvent.ADD_PANEL]: { actions: ShellAction.ADD_PANEL },
        [ShellEvent.REMOVE_PANEL]: { actions: ShellAction.REMOVE_PANEL },
        [ShellEvent.IDLE]: { actions: ShellAction.IDLE },
      },
    },
  },
}, {
  actions: {
    [ShellAction.ADD_PANEL]: assign(({ context, event, spawn }) => {
      if (event.type === ShellEvent.ADD_PANEL) {
        const panelId = event.panelId;
        const actor = spawn(panelMachine, { id: panelId });
        return {
          panels: [...context.panels, panelId],
          panelActors: { ...context.panelActors, [panelId]: actor },
        };
      }
      return { panels: context.panels, panelActors: context.panelActors };
    }),
    [ShellAction.REMOVE_PANEL]: assign(({ context, event }) => {
      if (event.type === ShellEvent.REMOVE_PANEL) {
        const panelId = event.panelId;
        // In XState v5, removing the actor reference automatically stops it
        const { [panelId]: _, ...restActors } = context.panelActors;
        return {
          panels: context.panels.filter(id => id !== panelId),
          panelActors: restActors,
        };
      }
      return { panels: context.panels, panelActors: context.panelActors };
    }),
    [ShellAction.IDLE]: () => {
      // IDLE action - no operation needed
    },
  },
});