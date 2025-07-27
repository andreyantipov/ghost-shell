import { describe, it, expect, vi } from 'vitest';
import { LayoutManager } from './LayoutManager';

describe('LayoutManager subscription tests', () => {
  it('should trigger subscription on addPanel', async () => {
    const layoutManager = new LayoutManager();
    const listener = vi.fn();
    
    // Subscribe to changes
    layoutManager.subscribe(listener);
    
    // Wait a bit for subscription to be ready
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // Add a panel
    layoutManager.addPanel('test-panel');
    
    // Check if listener was called
    expect(listener).toHaveBeenCalled();
  });
  
  it('should have panel in state after addPanel', () => {
    const layoutManager = new LayoutManager();
    
    layoutManager.addPanel('test-panel');
    
    const state = layoutManager.getSnapshot();
    expect(state.context.panels).toContain('test-panel');
  });
});