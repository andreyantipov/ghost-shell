import { describe, it, expect } from 'vitest';
import { createActor } from 'xstate';
import { panelMachine } from './panel.machine';
import { PanelEvent } from './panel.constants';

describe('panelMachine', () => {
  it('should start in active state', () => {
    const actor = createActor(panelMachine);
    actor.start();
    
    const snapshot = actor.getSnapshot();
    expect(snapshot.value).toBe('active');
    expect(snapshot.context.tabs).toEqual([]);
    expect(snapshot.context.activeTab).toBe(null);
    expect(snapshot.context.tabActors).toEqual({});
  });

  it('should add a tab', () => {
    const actor = createActor(panelMachine);
    actor.start();
    
    actor.send({ type: PanelEvent.ADD_TAB, tabId: 'tab-1', title: 'First Tab' });
    
    const snapshot = actor.getSnapshot();
    expect(snapshot.context.tabs).toContain('tab-1');
    expect(snapshot.context.activeTab).toBe('tab-1'); // First tab becomes active
    expect(snapshot.context.tabActors).toHaveProperty('tab-1');
  });

  it('should remove a tab', () => {
    const actor = createActor(panelMachine);
    actor.start();
    
    // Add tabs first
    actor.send({ type: PanelEvent.ADD_TAB, tabId: 'tab-1', title: 'First Tab' });
    actor.send({ type: PanelEvent.ADD_TAB, tabId: 'tab-2', title: 'Second Tab' });
    
    // Remove the first tab
    actor.send({ type: PanelEvent.REMOVE_TAB, tabId: 'tab-1' });
    
    const snapshot = actor.getSnapshot();
    expect(snapshot.context.tabs).not.toContain('tab-1');
    expect(snapshot.context.tabs).toContain('tab-2');
    expect(snapshot.context.activeTab).toBe('tab-2'); // Active tab switches to remaining tab
    expect(snapshot.context.tabActors).not.toHaveProperty('tab-1');
  });

  it('should activate a specific tab', () => {
    const actor = createActor(panelMachine);
    actor.start();
    
    // Add multiple tabs
    actor.send({ type: PanelEvent.ADD_TAB, tabId: 'tab-1', title: 'First Tab' });
    actor.send({ type: PanelEvent.ADD_TAB, tabId: 'tab-2', title: 'Second Tab' });
    actor.send({ type: PanelEvent.ADD_TAB, tabId: 'tab-3', title: 'Third Tab' });
    
    // Activate the second tab
    actor.send({ type: PanelEvent.ACTIVATE_TAB, tabId: 'tab-2' });
    
    const snapshot = actor.getSnapshot();
    expect(snapshot.context.activeTab).toBe('tab-2');
  });

  it('should not activate non-existent tab', () => {
    const actor = createActor(panelMachine);
    actor.start();
    
    actor.send({ type: PanelEvent.ADD_TAB, tabId: 'tab-1', title: 'First Tab' });
    actor.send({ type: PanelEvent.ACTIVATE_TAB, tabId: 'non-existent' });
    
    const snapshot = actor.getSnapshot();
    expect(snapshot.context.activeTab).toBe('tab-1'); // Should remain unchanged
  });

  it('should handle removing the active tab', () => {
    const actor = createActor(panelMachine);
    actor.start();
    
    // Add multiple tabs
    actor.send({ type: PanelEvent.ADD_TAB, tabId: 'tab-1', title: 'First Tab' });
    actor.send({ type: PanelEvent.ADD_TAB, tabId: 'tab-2', title: 'Second Tab' });
    actor.send({ type: PanelEvent.ADD_TAB, tabId: 'tab-3', title: 'Third Tab' });
    
    // Activate the middle tab
    actor.send({ type: PanelEvent.ACTIVATE_TAB, tabId: 'tab-2' });
    
    // Remove the active tab
    actor.send({ type: PanelEvent.REMOVE_TAB, tabId: 'tab-2' });
    
    const snapshot = actor.getSnapshot();
    expect(snapshot.context.activeTab).toBe('tab-1'); // Falls back to first available tab
    expect(snapshot.context.tabs).toEqual(['tab-1', 'tab-3']);
  });

  it('should clear activeTab when all tabs are removed', () => {
    const actor = createActor(panelMachine);
    actor.start();
    
    actor.send({ type: PanelEvent.ADD_TAB, tabId: 'tab-1', title: 'First Tab' });
    actor.send({ type: PanelEvent.REMOVE_TAB, tabId: 'tab-1' });
    
    const snapshot = actor.getSnapshot();
    expect(snapshot.context.tabs).toEqual([]);
    expect(snapshot.context.activeTab).toBe(null);
  });

  it('should handle events in both active and inactive states', () => {
    const actor = createActor(panelMachine);
    actor.start();
    
    // Test in active state
    expect(actor.getSnapshot().value).toBe('active');
    actor.send({ type: PanelEvent.ADD_TAB, tabId: 'tab-1', title: 'Tab in Active' });
    expect(actor.getSnapshot().context.tabs).toContain('tab-1');
    
    // Note: We'd need to add state transitions to test inactive state
    // For now, panel only has active/inactive states but no transitions between them
  });
});