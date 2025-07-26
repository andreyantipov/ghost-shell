import { createMachine } from 'xstate';
import { ID } from '~/lib/constants';
import type { TabContext } from '~/lib/types';

export const tabMachine = createMachine({
  types: {} as {
    context: TabContext;
    input: TabContext;
  },
  id: ID.TAB,
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