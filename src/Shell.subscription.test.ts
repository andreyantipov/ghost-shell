import { describe, it, expect, vi } from 'vitest';
import { Shell } from './Shell';

describe('Shell subscription tests', () => {
  it('should trigger subscription on addPanel', async () => {
    const shell = new Shell();
    const listener = vi.fn();
    
    // Subscribe to changes
    shell.subscribe(listener);
    
    // Wait a bit for subscription to be ready
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // Add a panel
    shell.addPanel('test-panel');
    
    // Check if listener was called
    expect(listener).toHaveBeenCalled();
  });
  
  it('should have panel in state after addPanel', () => {
    const shell = new Shell();
    
    shell.addPanel('test-panel');
    
    const state = shell.getSnapshot();
    expect(state.context.panels).toContain('test-panel');
  });
});