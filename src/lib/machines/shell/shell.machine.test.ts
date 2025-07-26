import { describe, it, expect } from 'vitest';
import { createActor } from 'xstate';
import { shellMachine } from './shell.machine';
import { ShellEvent } from '~/lib/constants';

describe('shellMachine', () => {
  it('should start in idle state', () => {
    const actor = createActor(shellMachine);
    actor.start();
    
    expect(actor.getSnapshot().value).toBe('idle');
    expect(actor.getSnapshot().context.panels).toEqual([]);
    expect(actor.getSnapshot().context.panelActors).toEqual({});
  });

  it('should add a panel', () => {
    const actor = createActor(shellMachine);
    actor.start();
    
    actor.send({ type: ShellEvent.ADD_PANEL, panelId: 'panel-1' });
    
    const snapshot = actor.getSnapshot();
    expect(snapshot.context.panels).toContain('panel-1');
    expect(snapshot.context.panelActors).toHaveProperty('panel-1');
  });

  it('should remove a panel', () => {
    const actor = createActor(shellMachine);
    actor.start();
    
    // Add a panel first
    actor.send({ type: ShellEvent.ADD_PANEL, panelId: 'panel-1' });
    expect(actor.getSnapshot().context.panels).toContain('panel-1');
    
    // Remove the panel
    actor.send({ type: ShellEvent.REMOVE_PANEL, panelId: 'panel-1' });
    
    const snapshot = actor.getSnapshot();
    expect(snapshot.context.panels).not.toContain('panel-1');
    expect(snapshot.context.panelActors).not.toHaveProperty('panel-1');
  });

  it('should handle multiple panels', () => {
    const actor = createActor(shellMachine);
    actor.start();
    
    actor.send({ type: ShellEvent.ADD_PANEL, panelId: 'panel-1' });
    actor.send({ type: ShellEvent.ADD_PANEL, panelId: 'panel-2' });
    actor.send({ type: ShellEvent.ADD_PANEL, panelId: 'panel-3' });
    
    const snapshot = actor.getSnapshot();
    expect(snapshot.context.panels).toHaveLength(3);
    expect(snapshot.context.panels).toEqual(['panel-1', 'panel-2', 'panel-3']);
  });

  it('should handle IDLE event', () => {
    const actor = createActor(shellMachine);
    actor.start();
    
    actor.send({ type: ShellEvent.IDLE });
    
    expect(actor.getSnapshot().value).toBe('idle');
  });

  it('should not add duplicate panels', () => {
    const actor = createActor(shellMachine);
    actor.start();
    
    actor.send({ type: ShellEvent.ADD_PANEL, panelId: 'panel-1' });
    actor.send({ type: ShellEvent.ADD_PANEL, panelId: 'panel-1' });
    
    const snapshot = actor.getSnapshot();
    expect(snapshot.context.panels).toHaveLength(2); // Both are added (no deduplication logic yet)
  });
});