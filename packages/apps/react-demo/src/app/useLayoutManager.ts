import { useRef, useSyncExternalStore, useCallback } from 'react';
import { LayoutManager } from '@ghost-shell/core';

let layoutManagerInstance: LayoutManager | null = null;
let listeners: Set<() => void> = new Set();
let currentSnapshot: any = null;
let version = 0;

// Force update all listeners
function notifyListeners() {
  version++;
  currentSnapshot = null; // Clear cache to force new snapshot
  listeners.forEach(listener => listener());
}

export function getLayoutManager() {
  if (!layoutManagerInstance) {
    layoutManagerInstance = new LayoutManager();
    
    // Subscribe to changes and notify all listeners
    layoutManagerInstance.subscribe(() => {
      notifyListeners();
    });
    
    // Wrap methods to force updates
    const originalAddTab = layoutManagerInstance.addTab.bind(layoutManagerInstance);
    layoutManagerInstance.addTab = (panelId: string, tabId: string, title?: string) => {
      originalAddTab(panelId, tabId, title);
      setTimeout(notifyListeners, 10);
    };
    
    const originalRemoveTab = layoutManagerInstance.removeTab.bind(layoutManagerInstance);
    layoutManagerInstance.removeTab = (panelId: string, tabId: string) => {
      originalRemoveTab(panelId, tabId);
      setTimeout(notifyListeners, 10);
    };
    
    const originalActivateTab = layoutManagerInstance.activateTab.bind(layoutManagerInstance);
    layoutManagerInstance.activateTab = (panelId: string, tabId: string) => {
      originalActivateTab(panelId, tabId);
      setTimeout(notifyListeners, 10);
    };
    
    const originalAddPanel = layoutManagerInstance.addPanel.bind(layoutManagerInstance);
    layoutManagerInstance.addPanel = (panelId: string) => {
      originalAddPanel(panelId);
      setTimeout(notifyListeners, 10);
    };
    
    const originalRemovePanel = layoutManagerInstance.removePanel.bind(layoutManagerInstance);
    layoutManagerInstance.removePanel = (panelId: string) => {
      originalRemovePanel(panelId);
      setTimeout(notifyListeners, 10);
    };
  }
  return layoutManagerInstance;
}

export function useLayoutManager() {
  const layoutManager = useRef(getLayoutManager()).current;
  
  const subscribe = useCallback((callback: () => void) => {
    listeners.add(callback);
    return () => {
      listeners.delete(callback);
    };
  }, []);
  
  const getSnapshot = useCallback(() => {
    // Cache the snapshot to avoid creating new objects
    if (!currentSnapshot || currentSnapshot._version !== version) {
      currentSnapshot = {
        ...layoutManager.getSnapshot(),
        _version: version
      };
    }
    return currentSnapshot;
  }, [layoutManager]);
  
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getSnapshot
  );

  return {
    layoutManager,
    snapshot,
    panels: snapshot.context.panelActors || {},
    statusBar: layoutManager.getStatusBarSnapshot(),
    getPanelSnapshot: useCallback((panelId: string) => {
      const panelActor = snapshot.context.panelActors?.[panelId];
      if (!panelActor) {
        return null;
      }
      try {
        return panelActor.getSnapshot();
      } catch (e) {
        console.error(`Error getting snapshot for panel ${panelId}:`, e);
        return null;
      }
    }, [snapshot.context.panelActors]),
  };
}