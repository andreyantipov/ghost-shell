import { shellMachine } from './lib/machines/shell/shell.machine';
import { createActor } from 'xstate';
import { ShellEvent, PanelEvent } from './lib/constants';

export class Shell {
  private actor = createActor(shellMachine);

  constructor() {
    this.actor.start();
  }

  subscribe(listener: () => void) {
    return this.actor.subscribe(listener);
  }

  getSnapshot() {
    return this.actor.getSnapshot();
  }

  addPanel(panelId: string) {
    this.actor.send({ type: ShellEvent.ADD_PANEL, panelId });
  }

  removePanel(panelId: string) {
    this.actor.send({ type: ShellEvent.REMOVE_PANEL, panelId });
  }

  idle() {
    this.actor.send({ type: ShellEvent.IDLE });
  }

  addTab(panelId: string, tabId: string, title?: string) {
    const panelActor = this.actor.getSnapshot().context.panelActors[panelId];
    if (panelActor) {
      panelActor.send({ type: PanelEvent.ADD_TAB, tabId, title });
      // Notify shell subscribers about the change
      this.actor.send({ type: ShellEvent.IDLE });
    }
  }

  removeTab(panelId: string, tabId: string) {
    const panelActor = this.actor.getSnapshot().context.panelActors[panelId];
    if (panelActor) {
      panelActor.send({ type: PanelEvent.REMOVE_TAB, tabId });
      // Notify shell subscribers about the change
      this.actor.send({ type: ShellEvent.IDLE });
    }
  }

  activateTab(panelId: string, tabId: string) {
    const panelActor = this.actor.getSnapshot().context.panelActors[panelId];
    if (panelActor) {
      panelActor.send({ type: PanelEvent.ACTIVATE_TAB, tabId });
      // Notify shell subscribers about the change
      this.actor.send({ type: ShellEvent.IDLE });
    }
  }

  getPanelSnapshot(panelId: string) {
    const snapshot = this.actor.getSnapshot();
    const panelActor = snapshot.context.panelActors[panelId];
    if (!panelActor) {
      console.warn(`Panel actor not found for panel: ${panelId}`);
      return null;
    }
    return panelActor.getSnapshot();
  }
}
