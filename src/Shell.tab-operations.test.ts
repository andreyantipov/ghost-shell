import { describe, it, expect, vi } from 'vitest';
import { Shell } from './Shell';

describe('Shell tab operations trigger re-render', () => {
  it('should notify subscribers when adding first tab', async () => {
    const shell = new Shell();
    const listener = vi.fn();
    
    // Add panel first
    shell.addPanel('panel-1');
    
    // Subscribe and clear initial calls
    shell.subscribe(listener);
    await new Promise(resolve => setTimeout(resolve, 10));
    listener.mockClear();
    
    // Add first tab should trigger re-render
    shell.addTab('panel-1', 'tab-1', 'First Tab');
    
    // Give it a moment
    await new Promise(resolve => setTimeout(resolve, 10));
    
    expect(listener).toHaveBeenCalled();
    console.log('Listener called times:', listener.mock.calls.length);
  });

  it('should notify subscribers when adding second tab', async () => {
    const shell = new Shell();
    const listener = vi.fn();
    
    // Setup: Add panel and first tab
    shell.addPanel('panel-1');
    shell.addTab('panel-1', 'tab-1', 'First Tab');
    
    // Subscribe and clear
    shell.subscribe(listener);
    await new Promise(resolve => setTimeout(resolve, 10));
    listener.mockClear();
    
    // Add second tab should also trigger re-render
    shell.addTab('panel-1', 'tab-2', 'Second Tab');
    
    await new Promise(resolve => setTimeout(resolve, 10));
    
    expect(listener).toHaveBeenCalled();
    console.log('Listener called for second tab:', listener.mock.calls.length);
  });

  it('panel should have correct tabs after operations', () => {
    const shell = new Shell();
    
    shell.addPanel('panel-1');
    shell.addTab('panel-1', 'tab-1', 'First Tab');
    shell.addTab('panel-1', 'tab-2', 'Second Tab');
    
    const panelSnapshot = shell.getPanelSnapshot('panel-1');
    
    expect(panelSnapshot?.context.tabs).toEqual(['tab-1', 'tab-2']);
    expect(panelSnapshot?.context.activeTab).toBe('tab-1');
  });
});