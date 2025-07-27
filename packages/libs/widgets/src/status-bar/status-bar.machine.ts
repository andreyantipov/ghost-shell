import { createMachine, assign } from 'xstate';
import { STATUS_BAR_ID, StatusBarEvent, StatusBarState, StatusBarAction } from './status-bar.constants';
import type { StatusBarContext, StatusBarEventObject } from './status-bar.types';

export const statusBarMachine = createMachine({
  types: {} as {
    context: StatusBarContext;
    events: StatusBarEventObject;
  },
  id: STATUS_BAR_ID,
  initial: StatusBarState.IDLE,
  context: {
    status: 'Ready',
    items: [],
  },
  states: {
    [StatusBarState.IDLE]: {
      on: {
        [StatusBarEvent.UPDATE_STATUS]: { 
          actions: StatusBarAction.UPDATE_STATUS,
        },
        [StatusBarEvent.ADD_ITEM]: { 
          actions: StatusBarAction.ADD_ITEM,
        },
        [StatusBarEvent.REMOVE_ITEM]: { 
          actions: StatusBarAction.REMOVE_ITEM,
        },
        [StatusBarEvent.CLEAR]: { 
          actions: StatusBarAction.CLEAR,
        },
      },
    },
  },
}, {
  actions: {
    [StatusBarAction.UPDATE_STATUS]: assign(({ context, event }) => {
      if (event.type === StatusBarEvent.UPDATE_STATUS) {
        return { ...context, status: event.text };
      }
      return context;
    }),
    [StatusBarAction.ADD_ITEM]: assign(({ context, event }) => {
      if (event.type === StatusBarEvent.ADD_ITEM) {
        const items = [...context.items, event.item].sort((a, b) => 
          (b.priority || 0) - (a.priority || 0)
        );
        return { ...context, items };
      }
      return context;
    }),
    [StatusBarAction.REMOVE_ITEM]: assign(({ context, event }) => {
      if (event.type === StatusBarEvent.REMOVE_ITEM) {
        return { ...context, items: context.items.filter(item => item.id !== event.itemId) };
      }
      return context;
    }),
    [StatusBarAction.CLEAR]: assign(() => ({
      status: 'Ready',
      items: [],
    })),
  },
});