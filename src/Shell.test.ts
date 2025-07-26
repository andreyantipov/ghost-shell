import { describe, it, expect, vi } from 'vitest';
import { Shell } from './Shell';

describe('Shell UI Update Tests', () => {
  it('should notify subscribers when adding tab', () => {
    const shell = new Shell();
    const subscriber = vi.fn();
    
    shell.subscribe(subscriber);
    shell.addPanel('panel-1');
    
    // Reset call count after panel add
    subscriber.mockClear();
    
    // Add tab should trigger subscriber
    shell.addTab('panel-1', 'tab-1', 'Test Tab');
    
    expect(subscriber).toHaveBeenCalled();
  });

  it('should notify subscribers when removing tab', () => {
    const shell = new Shell();
    const subscriber = vi.fn();
    
    shell.subscribe(subscriber);
    shell.addPanel('panel-1');
    shell.addTab('panel-1', 'tab-1', 'Test Tab');
    
    // Reset call count
    subscriber.mockClear();
    
    // Remove tab should trigger subscriber
    shell.removeTab('panel-1', 'tab-1');
    
    expect(subscriber).toHaveBeenCalled();
  });

  it('should notify subscribers when activating tab', () => {
    const shell = new Shell();
    const subscriber = vi.fn();
    
    shell.subscribe(subscriber);
    shell.addPanel('panel-1');
    shell.addTab('panel-1', 'tab-1', 'Tab 1');
    shell.addTab('panel-1', 'tab-2', 'Tab 2');
    
    // Reset call count
    subscriber.mockClear();
    
    // Activate tab should trigger subscriber
    shell.activateTab('panel-1', 'tab-2');
    
    expect(subscriber).toHaveBeenCalled();
  });

  it('should not notify when operating on non-existent panel', () => {
    const shell = new Shell();
    const subscriber = vi.fn();
    
    shell.subscribe(subscriber);
    
    // These should not trigger subscriber as panel doesn't exist
    shell.addTab('non-existent', 'tab-1', 'Tab');
    shell.removeTab('non-existent', 'tab-1');
    shell.activateTab('non-existent', 'tab-1');
    
    expect(subscriber).not.toHaveBeenCalled();
  });
});