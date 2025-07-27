import { describe, it, expect } from 'vitest';
import { LayoutManager } from '~/layout-manager/LayoutManager';

describe('LayoutManager Integration Tests', () => {
  it('should add panel and then add tab to that panel', () => {
    const layoutManager = new LayoutManager();
    
    // Add a panel
    layoutManager.addPanel('panel-1');
    
    const layoutManagerSnapshot = layoutManager.getSnapshot();
    expect(layoutManagerSnapshot.context.panels).toContain('panel-1');
    
    // Add a tab to the panel
    layoutManager.addTab('panel-1', 'tab-1', 'First Tab');
    
    // Get panel snapshot
    const panelSnapshot = layoutManager.getPanelSnapshot('panel-1');
    expect(panelSnapshot).toBeTruthy();
    expect(panelSnapshot?.context.tabs).toContain('tab-1');
    expect(panelSnapshot?.context.activeTab).toBe('tab-1');
  });

  it('should handle multiple panels with tabs', () => {
    const layoutManager = new LayoutManager();
    
    // Add two panels
    layoutManager.addPanel('panel-1');
    layoutManager.addPanel('panel-2');
    
    // Add tabs to first panel
    layoutManager.addTab('panel-1', 'tab-1', 'Tab 1');
    layoutManager.addTab('panel-1', 'tab-2', 'Tab 2');
    
    // Add tabs to second panel
    layoutManager.addTab('panel-2', 'tab-3', 'Tab 3');
    
    const panel1 = layoutManager.getPanelSnapshot('panel-1');
    const panel2 = layoutManager.getPanelSnapshot('panel-2');
    
    expect(panel1?.context.tabs).toEqual(['tab-1', 'tab-2']);
    expect(panel2?.context.tabs).toEqual(['tab-3']);
  });

  it('should not add tab to non-existent panel', () => {
    const layoutManager = new LayoutManager();
    
    // Try to add tab without panel
    layoutManager.addTab('non-existent', 'tab-1', 'Tab 1');
    
    const panelSnapshot = layoutManager.getPanelSnapshot('non-existent');
    expect(panelSnapshot).toBeNull();
  });

  it('should remove tab from panel', () => {
    const layoutManager = new LayoutManager();
    
    layoutManager.addPanel('panel-1');
    layoutManager.addTab('panel-1', 'tab-1', 'Tab 1');
    layoutManager.addTab('panel-1', 'tab-2', 'Tab 2');
    
    // Verify tabs exist
    let panelSnapshot = layoutManager.getPanelSnapshot('panel-1');
    expect(panelSnapshot?.context.tabs).toHaveLength(2);
    
    // Remove a tab
    layoutManager.removeTab('panel-1', 'tab-1');
    
    panelSnapshot = layoutManager.getPanelSnapshot('panel-1');
    expect(panelSnapshot?.context.tabs).toEqual(['tab-2']);
    expect(panelSnapshot?.context.activeTab).toBe('tab-2');
  });

  it('should activate specific tab', () => {
    const layoutManager = new LayoutManager();
    
    layoutManager.addPanel('panel-1');
    layoutManager.addTab('panel-1', 'tab-1', 'Tab 1');
    layoutManager.addTab('panel-1', 'tab-2', 'Tab 2');
    layoutManager.addTab('panel-1', 'tab-3', 'Tab 3');
    
    // Activate tab-2
    layoutManager.activateTab('panel-1', 'tab-2');
    
    const panelSnapshot = layoutManager.getPanelSnapshot('panel-1');
    expect(panelSnapshot?.context.activeTab).toBe('tab-2');
  });
});