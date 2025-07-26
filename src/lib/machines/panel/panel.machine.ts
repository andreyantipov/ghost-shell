import { createMachine, assign } from 'xstate';
import { ID, PanelState, PanelEvent, PanelAction } from '~/lib/constants';
import { tabMachine } from '../tab/tab.machine';
import type { PanelContext, PanelEventObject } from '~/lib/types';

export const panelMachine = createMachine({
  types: {} as {
    context: PanelContext;
    events: PanelEventObject;
  },
  id: ID.PANEL,
  initial: PanelState.ACTIVE,
  context: {
    tabs: [],
    activeTab: null,
    tabActors: {},
  },
  states: {
    [PanelState.ACTIVE]: {
      on: {
        [PanelEvent.ADD_TAB]: { actions: PanelAction.ADD_TAB },
        [PanelEvent.REMOVE_TAB]: { actions: PanelAction.REMOVE_TAB },
        [PanelEvent.ACTIVATE_TAB]: { actions: PanelAction.ACTIVATE_TAB },
      },
    },
    [PanelState.INACTIVE]: {
      on: {
        [PanelEvent.ADD_TAB]: { actions: PanelAction.ADD_TAB },
        [PanelEvent.REMOVE_TAB]: { actions: PanelAction.REMOVE_TAB },
        [PanelEvent.ACTIVATE_TAB]: { actions: PanelAction.ACTIVATE_TAB },
      },
    },
  },
}, {
  actions: {
    [PanelAction.ADD_TAB]: assign(({ context, event, spawn }) => {
      if (event.type === PanelEvent.ADD_TAB) {
        const tabId = event.tabId;
        const title = event.title || 'New Tab';
        const actor = spawn(tabMachine, { 
          id: tabId,
          input: { id: tabId, title }
        });
        return {
          tabs: [...context.tabs, tabId],
          activeTab: context.activeTab || tabId,
          tabActors: { ...context.tabActors, [tabId]: actor },
        };
      }
      return context;
    }),
    [PanelAction.REMOVE_TAB]: assign(({ context, event }) => {
      if (event.type === PanelEvent.REMOVE_TAB) {
        const tabId = event.tabId;
        // In XState v5, removing the actor reference automatically stops it
        const { [tabId]: _, ...restActors } = context.tabActors;
        const remainingTabs = context.tabs.filter(id => id !== tabId);
        const newActiveTab = context.activeTab === tabId 
          ? remainingTabs[0] || null 
          : context.activeTab;
        return {
          tabs: remainingTabs,
          activeTab: newActiveTab,
          tabActors: restActors,
        };
      }
      return context;
    }),
    [PanelAction.ACTIVATE_TAB]: assign(({ context, event }) => {
      if (event.type === PanelEvent.ACTIVATE_TAB && context.tabs.includes(event.tabId)) {
        return {
          ...context,
          activeTab: event.tabId,
        };
      }
      return context;
    }),
  },
});
