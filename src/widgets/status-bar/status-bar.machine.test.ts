import { describe, it, expect } from 'vitest';
import { createActor } from 'xstate';
import { statusBarMachine } from './status-bar.machine';
import { StatusBarEvent } from './status-bar.constants';
import type { StatusBarItem } from './status-bar.types';

describe('StatusBarMachine', () => {
  it('should initialize with default context', () => {
    const actor = createActor(statusBarMachine);
    actor.start();
    
    const snapshot = actor.getSnapshot();
    expect(snapshot.context.status).toBe('Ready');
    expect(snapshot.context.items).toEqual([]);
    
    actor.stop();
  });

  it('should update status text', () => {
    const actor = createActor(statusBarMachine);
    actor.start();
    
    actor.send({ type: StatusBarEvent.UPDATE_STATUS, text: 'Loading...' });
    
    const snapshot = actor.getSnapshot();
    expect(snapshot.context.status).toBe('Loading...');
    
    actor.stop();
  });

  it('should add status bar items', () => {
    const actor = createActor(statusBarMachine);
    actor.start();
    
    const item1: StatusBarItem = {
      id: 'item1',
      text: 'Item 1',
      priority: 10,
    };
    
    const item2: StatusBarItem = {
      id: 'item2',
      text: 'Item 2',
      priority: 5,
    };
    
    actor.send({ type: StatusBarEvent.ADD_ITEM, item: item1 });
    actor.send({ type: StatusBarEvent.ADD_ITEM, item: item2 });
    
    const snapshot = actor.getSnapshot();
    expect(snapshot.context.items).toHaveLength(2);
    // Items should be sorted by priority (descending)
    expect(snapshot.context.items[0].id).toBe('item1');
    expect(snapshot.context.items[1].id).toBe('item2');
    
    actor.stop();
  });

  it('should remove status bar items', () => {
    const actor = createActor(statusBarMachine);
    actor.start();
    
    const item: StatusBarItem = {
      id: 'item1',
      text: 'Item 1',
    };
    
    actor.send({ type: StatusBarEvent.ADD_ITEM, item });
    actor.send({ type: StatusBarEvent.REMOVE_ITEM, itemId: 'item1' });
    
    const snapshot = actor.getSnapshot();
    expect(snapshot.context.items).toHaveLength(0);
    
    actor.stop();
  });

  it('should clear all items and reset status', () => {
    const actor = createActor(statusBarMachine);
    actor.start();
    
    const item: StatusBarItem = {
      id: 'item1',
      text: 'Item 1',
    };
    
    actor.send({ type: StatusBarEvent.UPDATE_STATUS, text: 'Working...' });
    actor.send({ type: StatusBarEvent.ADD_ITEM, item });
    actor.send({ type: StatusBarEvent.CLEAR });
    
    const snapshot = actor.getSnapshot();
    expect(snapshot.context.status).toBe('Ready');
    expect(snapshot.context.items).toHaveLength(0);
    
    actor.stop();
  });

  it('should sort items by priority when adding', () => {
    const actor = createActor(statusBarMachine);
    actor.start();
    
    const items: StatusBarItem[] = [
      { id: 'low', text: 'Low', priority: 1 },
      { id: 'high', text: 'High', priority: 10 },
      { id: 'medium', text: 'Medium', priority: 5 },
      { id: 'none', text: 'None' }, // No priority defaults to 0
    ];
    
    items.forEach(item => {
      actor.send({ type: StatusBarEvent.ADD_ITEM, item });
    });
    
    const snapshot = actor.getSnapshot();
    const sortedIds = snapshot.context.items.map(item => item.id);
    expect(sortedIds).toEqual(['high', 'medium', 'low', 'none']);
    
    actor.stop();
  });
});