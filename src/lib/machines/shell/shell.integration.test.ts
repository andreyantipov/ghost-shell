import { describe, it, expect } from 'vitest';
import { Shell } from '~/Shell';

describe('Shell Integration Tests', () => {
  it('should add panel and then add tab to that panel', () => {
    const shell = new Shell();
    
    // Add a panel
    shell.addPanel('panel-1');
    
    const shellSnapshot = shell.getSnapshot();
    expect(shellSnapshot.context.panels).toContain('panel-1');
    
    // Add a tab to the panel
    shell.addTab('panel-1', 'tab-1', 'First Tab');
    
    // Get panel snapshot
    const panelSnapshot = shell.getPanelSnapshot('panel-1');
    expect(panelSnapshot).toBeTruthy();
    expect(panelSnapshot?.context.tabs).toContain('tab-1');
    expect(panelSnapshot?.context.activeTab).toBe('tab-1');
  });

  it('should handle multiple panels with tabs', () => {
    const shell = new Shell();
    
    // Add two panels
    shell.addPanel('panel-1');
    shell.addPanel('panel-2');
    
    // Add tabs to first panel
    shell.addTab('panel-1', 'tab-1', 'Tab 1');
    shell.addTab('panel-1', 'tab-2', 'Tab 2');
    
    // Add tabs to second panel
    shell.addTab('panel-2', 'tab-3', 'Tab 3');
    
    const panel1 = shell.getPanelSnapshot('panel-1');
    const panel2 = shell.getPanelSnapshot('panel-2');
    
    expect(panel1?.context.tabs).toEqual(['tab-1', 'tab-2']);
    expect(panel2?.context.tabs).toEqual(['tab-3']);
  });

  it('should not add tab to non-existent panel', () => {
    const shell = new Shell();
    
    // Try to add tab without panel
    shell.addTab('non-existent', 'tab-1', 'Tab 1');
    
    const panelSnapshot = shell.getPanelSnapshot('non-existent');
    expect(panelSnapshot).toBeNull();
  });

  it('should remove tab from panel', () => {
    const shell = new Shell();
    
    shell.addPanel('panel-1');
    shell.addTab('panel-1', 'tab-1', 'Tab 1');
    shell.addTab('panel-1', 'tab-2', 'Tab 2');
    
    // Verify tabs exist
    let panelSnapshot = shell.getPanelSnapshot('panel-1');
    expect(panelSnapshot?.context.tabs).toHaveLength(2);
    
    // Remove a tab
    shell.removeTab('panel-1', 'tab-1');
    
    panelSnapshot = shell.getPanelSnapshot('panel-1');
    expect(panelSnapshot?.context.tabs).toEqual(['tab-2']);
    expect(panelSnapshot?.context.activeTab).toBe('tab-2');
  });

  it('should activate specific tab', () => {
    const shell = new Shell();
    
    shell.addPanel('panel-1');
    shell.addTab('panel-1', 'tab-1', 'Tab 1');
    shell.addTab('panel-1', 'tab-2', 'Tab 2');
    shell.addTab('panel-1', 'tab-3', 'Tab 3');
    
    // Activate tab-2
    shell.activateTab('panel-1', 'tab-2');
    
    const panelSnapshot = shell.getPanelSnapshot('panel-1');
    expect(panelSnapshot?.context.activeTab).toBe('tab-2');
  });
});