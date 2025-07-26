import { createMachine } from 'xstate';
import { TAB_ID } from './tab.constants';
import type { TabContext } from './tab.types';

export const tabMachine = createMachine({
  types: {} as {
    context: TabContext;
    input: TabContext;
  },
  id: TAB_ID,
  initial: 'active',
  context: ({ input }) => ({
    id: input?.id ?? '',
    title: input?.title ?? 'New Tab',
  }),
  states: {
    active: {},
    inactive: {},
    closed: {
      type: 'final',
    },
  },
});