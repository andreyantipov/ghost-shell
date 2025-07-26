import { describe, it, expect, vi } from 'vitest';
import { LayoutManager } from './LayoutManager';

describe('LayoutManager UI Update Tests', () => {
  it('should notify subscribers when adding tab', () => {
    const layoutManager = new LayoutManager();
    const subscriber = vi.fn();
    
    layoutManager.subscribe(subscriber);
    layoutManager.addPanel('panel-1');
    
    // Reset call count after panel add
    subscriber.mockClear();
    
    // Add tab should trigger subscriber
    layoutManager.addTab('panel-1', 'tab-1', 'Test Tab');
    
    expect(subscriber).toHaveBeenCalled();
  });

  it('should notify subscribers when removing tab', () => {
    const layoutManager = new LayoutManager();
    const subscriber = vi.fn();
    
    layoutManager.subscribe(subscriber);
    layoutManager.addPanel('panel-1');
    layoutManager.addTab('panel-1', 'tab-1', 'Test Tab');
    
    // Reset call count
    subscriber.mockClear();
    
    // Remove tab should trigger subscriber
    layoutManager.removeTab('panel-1', 'tab-1');
    
    expect(subscriber).toHaveBeenCalled();
  });

  it('should notify subscribers when activating tab', () => {
    const layoutManager = new LayoutManager();
    const subscriber = vi.fn();
    
    layoutManager.subscribe(subscriber);
    layoutManager.addPanel('panel-1');
    layoutManager.addTab('panel-1', 'tab-1', 'Tab 1');
    layoutManager.addTab('panel-1', 'tab-2', 'Tab 2');
    
    // Reset call count
    subscriber.mockClear();
    
    // Activate tab should trigger subscriber
    layoutManager.activateTab('panel-1', 'tab-2');
    
    expect(subscriber).toHaveBeenCalled();
  });

  it('should not notify when operating on non-existent panel', () => {
    const layoutManager = new LayoutManager();
    const subscriber = vi.fn();
    
    layoutManager.subscribe(subscriber);
    
    // These should not trigger subscriber as panel doesn't exist
    layoutManager.addTab('non-existent', 'tab-1', 'Tab');
    layoutManager.removeTab('non-existent', 'tab-1');
    layoutManager.activateTab('non-existent', 'tab-1');
    
    expect(subscriber).not.toHaveBeenCalled();
  });
});