import { describe, it, expect } from 'vitest';
import { createActor } from 'xstate';
import { tabMachine } from './tab.machine';

describe('tabMachine', () => {
  it('should start in active state', () => {
    const actor = createActor(tabMachine);
    actor.start();
    
    expect(actor.getSnapshot().value).toBe('active');
  });

  it('should have default context values', () => {
    const actor = createActor(tabMachine);
    actor.start();
    
    const snapshot = actor.getSnapshot();
    expect(snapshot.context.id).toBe('');
    expect(snapshot.context.title).toBe('New Tab');
  });

  it('should accept input for id and title', () => {
    const actor = createActor(tabMachine, {
      input: { id: 'tab-1', title: 'Custom Tab' }
    });
    actor.start();
    
    const snapshot = actor.getSnapshot();
    expect(snapshot.context.id).toBe('tab-1');
    expect(snapshot.context.title).toBe('Custom Tab');
  });

  it('should handle partial input', () => {
    const actor = createActor(tabMachine, {
      input: { id: 'tab-2', title: '' }
    });
    actor.start();
    
    const snapshot = actor.getSnapshot();
    expect(snapshot.context.id).toBe('tab-2');
    expect(snapshot.context.title).toBe(''); // Empty string is kept as-is
  });

  it('should have closed as final state', () => {
    const actor = createActor(tabMachine);
    actor.start();
    
    // Note: We don't have transitions defined to reach closed state yet
    // This test just verifies the state exists in the machine definition
    expect(tabMachine.states).toHaveProperty('closed');
    expect(tabMachine.states.closed.type).toBe('final');
  });

  it('should have inactive state', () => {
    const actor = createActor(tabMachine);
    actor.start();
    
    // Note: We don't have transitions defined to reach inactive state yet
    // This test just verifies the state exists in the machine definition
    expect(tabMachine.states).toHaveProperty('inactive');
  });
});