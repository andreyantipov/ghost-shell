import { describe, it, expect, vi } from 'vitest';
import { LayoutManager } from './LayoutManager';

describe('LayoutManager tab operations trigger re-render', () => {
  it('should notify subscribers when adding first tab', async () => {
    const layoutManager = new LayoutManager();
    const listener = vi.fn();
    
    // Add panel first
    layoutManager.addPanel('panel-1');
    
    // Subscribe and clear initial calls
    layoutManager.subscribe(listener);
    await new Promise(resolve => setTimeout(resolve, 10));
    listener.mockClear();
    
    // Add first tab should trigger re-render
    layoutManager.addTab('panel-1', 'tab-1', 'First Tab');
    
    // Give it a moment
    await new Promise(resolve => setTimeout(resolve, 10));
    
    expect(listener).toHaveBeenCalled();
    console.log('Listener called times:', listener.mock.calls.length);
  });

  it('should notify subscribers when adding second tab', async () => {
    const layoutManager = new LayoutManager();
    const listener = vi.fn();
    
    // Setup: Add panel and first tab
    layoutManager.addPanel('panel-1');
    layoutManager.addTab('panel-1', 'tab-1', 'First Tab');
    
    // Subscribe and clear
    layoutManager.subscribe(listener);
    await new Promise(resolve => setTimeout(resolve, 10));
    listener.mockClear();
    
    // Add second tab should also trigger re-render
    layoutManager.addTab('panel-1', 'tab-2', 'Second Tab');
    
    await new Promise(resolve => setTimeout(resolve, 10));
    
    expect(listener).toHaveBeenCalled();
    console.log('Listener called for second tab:', listener.mock.calls.length);
  });

  it('panel should have correct tabs after operations', () => {
    const layoutManager = new LayoutManager();
    
    layoutManager.addPanel('panel-1');
    layoutManager.addTab('panel-1', 'tab-1', 'First Tab');
    layoutManager.addTab('panel-1', 'tab-2', 'Second Tab');
    
    const panelSnapshot = layoutManager.getPanelSnapshot('panel-1');
    
    expect(panelSnapshot?.context.tabs).toEqual(['tab-1', 'tab-2']);
    expect(panelSnapshot?.context.activeTab).toBe('tab-1');
  });
});