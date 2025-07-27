import { createActor } from 'xstate';

import { shellMachine } from '../widgets/shell/shell.machine';
import { ShellEvent } from '../widgets/shell/shell.constants';
import { PanelEvent } from '../widgets/panel/panel.constants';
import { StatusBarEvent } from '../widgets/status-bar/status-bar.constants';
import type { StatusBarItem } from '../widgets/status-bar/status-bar.types';

export class LayoutManager {
  private shell = createActor(shellMachine);

  constructor() {
    this.shell.start();
  }

  subscribe(listener: () => void) {
    return this.shell.subscribe(listener);
  }

  getSnapshot() {
    return this.shell.getSnapshot();
  }

  addPanel(panelId: string) {
    this.shell.send({ type: ShellEvent.ADD_PANEL, panelId });
  }

  removePanel(panelId: string) {
    this.shell.send({ type: ShellEvent.REMOVE_PANEL, panelId });
  }

  addTab(panelId: string, tabId: string, title?: string) {
    const panelActor = this.shell.getSnapshot().context.panelActors[panelId];
    if (panelActor) {
      panelActor.send({ type: PanelEvent.ADD_TAB, tabId, title });
      // Notify shell subscribers about the change
      this.shell.send({ type: ShellEvent.IDLE });
    }
  }

  removeTab(panelId: string, tabId: string) {
    const panelActor = this.shell.getSnapshot().context.panelActors[panelId];
    if (panelActor) {
      panelActor.send({ type: PanelEvent.REMOVE_TAB, tabId });
      // Notify shell subscribers about the change
      this.shell.send({ type: ShellEvent.IDLE });
    }
  }

  activateTab(panelId: string, tabId: string) {
    const panelActor = this.shell.getSnapshot().context.panelActors[panelId];
    if (panelActor) {
      panelActor.send({ type: PanelEvent.ACTIVATE_TAB, tabId });
      // Notify shell subscribers about the change
      this.shell.send({ type: ShellEvent.IDLE });
    }
  }

  getPanelSnapshot(panelId: string) {
    const snapshot = this.shell.getSnapshot();
    const panelActor = snapshot.context.panelActors[panelId];
    if (!panelActor) {
      console.warn(`Panel actor not found for panel: ${panelId}`);
      return null;
    }
    return panelActor.getSnapshot();
  }

  // Status Bar Methods
  updateStatusBarText(text: string) {
    const statusBarActor = this.shell.getSnapshot().context.statusBarActor;
    if (statusBarActor) {
      statusBarActor.send({ type: StatusBarEvent.UPDATE_STATUS, text });
    }
  }

  addStatusBarItem(item: StatusBarItem) {
    const statusBarActor = this.shell.getSnapshot().context.statusBarActor;
    if (statusBarActor) {
      statusBarActor.send({ type: StatusBarEvent.ADD_ITEM, item });
    }
  }

  removeStatusBarItem(itemId: string) {
    const statusBarActor = this.shell.getSnapshot().context.statusBarActor;
    if (statusBarActor) {
      statusBarActor.send({ type: StatusBarEvent.REMOVE_ITEM, itemId });
    }
  }

  clearStatusBar() {
    const statusBarActor = this.shell.getSnapshot().context.statusBarActor;
    if (statusBarActor) {
      statusBarActor.send({ type: StatusBarEvent.CLEAR });
    }
  }

  getStatusBarSnapshot() {
    const statusBarActor = this.shell.getSnapshot().context.statusBarActor;
    if (!statusBarActor) {
      console.warn('Status bar actor not found');
      return null;
    }
    return statusBarActor.getSnapshot();
  }
}