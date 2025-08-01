import React, { useEffect, useRef, useState } from 'react';
import { useLayoutManager } from './useLayoutManager';
import './App.css';

interface Tab {
  id: string;
  title?: string;
}

interface PanelSnapshot {
  context: {
    tabs: string[];
    activeTab: string | null;
    tabActors: Record<string, any>;
  };
}

interface StatusBarItem {
  id: string;
  text: string;
  position: 'left' | 'right';
}

export const App: React.FC = () => {
  const { layoutManager, panels, statusBar, getPanelSnapshot } = useLayoutManager();
  const [isReady, setIsReady] = useState(false);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    // Initialize panels with a small delay to ensure state updates
    const initializePanels = async () => {
      // Initialize all panels
      layoutManager.addPanel('editor');
      layoutManager.addPanel('terminal');
      layoutManager.addPanel('explorer');
      
      // Wait a bit for panels to be created
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Add tabs to editor
      layoutManager.addTab('editor', 'file1', 'App.tsx');
      layoutManager.addTab('editor', 'file2', 'index.ts');
      layoutManager.activateTab('editor', 'file1');
      
      // Add tab to terminal
      layoutManager.addTab('terminal', 'term1', 'Terminal');
      layoutManager.activateTab('terminal', 'term1');
      
      // Add tab to explorer
      layoutManager.addTab('explorer', 'files', 'Explorer');
      layoutManager.activateTab('explorer', 'files');

      // Update status bar
      layoutManager.updateStatusBarText('Ready');
      layoutManager.addStatusBarItem({
        id: 'branch',
        text: '🌿 main',
        position: 'left'
      });
      layoutManager.addStatusBarItem({
        id: 'encoding',
        text: 'UTF-8',
        position: 'right'
      });
      layoutManager.addStatusBarItem({
        id: 'line-col',
        text: 'Ln 1, Col 1',
        position: 'right'
      });
      
      setIsReady(true);
    };
    
    initializePanels();
  }, [layoutManager]);

  const handleAddTab = (panelId: string) => {
    const name = prompt('Enter tab name:');
    if (name && name.trim()) {
      const tabId = `tab-${Date.now()}`;
      layoutManager.addTab(panelId, tabId, name);
      // Small delay to ensure state updates
      setTimeout(() => {
        layoutManager.activateTab(panelId, tabId);
      }, 50);
    }
  };

  const handleAddPanel = () => {
    const panelName = prompt('Enter panel name:') || `Panel ${Date.now()}`;
    const panelId = `panel-${Date.now()}`;
    layoutManager.addPanel(panelId);
    // Add a small delay before adding tab
    setTimeout(() => {
      layoutManager.addTab(panelId, 'tab1', panelName);
      layoutManager.activateTab(panelId, 'tab1');
    }, 100);
  };

  const renderTabs = (panelId: string, panel: PanelSnapshot | null) => {
    if (!panel) return null;
    
    return (
      <div className="tab-bar">
        {panel.context.tabs.map((tabId) => {
          const tabActor = panel.context.tabActors?.[tabId];
          const tabData = tabActor?.getSnapshot();
          const title = tabData?.context?.title || tabId;
          
          return (
            <div
              key={tabId}
              className={`tab ${panel.context.activeTab === tabId ? 'active' : ''}`}
              onClick={() => layoutManager.activateTab(panelId, tabId)}
            >
              <span className="tab-label">{title}</span>
              {panel.context.tabs.length > 1 && (
                <button
                  className="tab-close"
                  onClick={(e) => {
                    e.stopPropagation();
                    layoutManager.removeTab(panelId, tabId);
                  }}
                >
                  ×
                </button>
              )}
            </div>
          );
        })}
        <button 
          className="add-tab-button"
          onClick={() => handleAddTab(panelId)}
          title="Add new tab"
        >
          +
        </button>
      </div>
    );
  };

  const renderPanelContent = (panelId: string) => {
    const panel = getPanelSnapshot(panelId);
    if (!panel || !panel.context.activeTab) {
      return <div className="empty-panel">No active tab</div>;
    }

    const activeTabId = panel.context.activeTab;
    const tabActor = panel.context.tabActors?.[activeTabId];
    const activeTab = tabActor?.getSnapshot()?.context;
    
    switch(panelId) {
      case 'editor':
        return (
          <div className="editor-text">
            <div className="line-numbers">
              {Array.from({length: 20}, (_, i) => (
                <div key={i} className="line-number">{i + 1}</div>
              ))}
            </div>
            <pre className="code-content">{`// ${activeTab?.title || 'Untitled'}
import React, { useEffect, useState } from 'react';
import { LayoutManager } from '@ghost-shell/core';

export const App: React.FC = () => {
  const { layoutManager } = useLayoutManager();
  
  useEffect(() => {
    // Initialize panels
    layoutManager.addPanel('editor');
    layoutManager.addPanel('terminal');
    layoutManager.addPanel('explorer');
    
    // Add tabs
    layoutManager.addTab('editor', 'file1', 'App.tsx');
    layoutManager.addTab('terminal', 'term1', 'Terminal');
  }, []);
  
  return (
    <div className="app">
      <h1>Ghost Shell Demo</h1>
      <p>Editing: ${activeTab?.title}</p>
    </div>
  );
};`}</pre>
          </div>
        );
      case 'terminal':
        return (
          <div className="terminal-text">
            <div className="terminal-line">$ npm run dev</div>
            <div className="terminal-line">
              <span style={{color: '#4ec9b0'}}>&gt;</span> vite
            </div>
            <div className="terminal-line" style={{marginTop: '8px', color: '#4ec9b0'}}>
              VITE v7.0.6  ready in 191 ms
            </div>
            <div className="terminal-line" style={{marginTop: '8px'}}>
              <span style={{color: '#4ec9b0'}}>➜</span>  <span style={{fontWeight: 'bold'}}>Local</span>:   
              <span style={{color: '#569cd6'}}> http://localhost:4200/</span>
            </div>
            <div className="terminal-line terminal-cursor" style={{marginTop: '16px'}}>$ _</div>
          </div>
        );
      case 'explorer':
        return (
          <div className="tree-view">
            <div className="tree-section">
              <div className="tree-item expandable">
                <span className="tree-arrow">▼</span> 
                <span className="tree-icon">📁</span> src
              </div>
              <div className="tree-item indent">
                <span className="tree-icon">📄</span> App.tsx
              </div>
              <div className="tree-item indent">
                <span className="tree-icon">📄</span> main.tsx
              </div>
              <div className="tree-item indent">
                <span className="tree-icon">📄</span> useLayoutManager.ts
              </div>
            </div>
            <div className="tree-section">
              <div className="tree-item">
                <span className="tree-arrow">▶</span>
                <span className="tree-icon">📁</span> components
              </div>
            </div>
            <div className="tree-item">
              <span className="tree-icon">📄</span> package.json
            </div>
            <div className="tree-item">
              <span className="tree-icon">📄</span> tsconfig.json
            </div>
            <div className="tree-item">
              <span className="tree-icon">📄</span> vite.config.ts
            </div>
          </div>
        );
      default:
        return (
          <div className="panel-default-content">
            <h3>Panel: {panelId}</h3>
            <p>Active tab: {activeTab?.title || 'None'}</p>
            <div className="panel-info">
              This is a custom panel. You can add your own content here.
            </div>
          </div>
        );
    }
  };

  // Get panel snapshots
  const editorPanel = getPanelSnapshot('editor');
  const terminalPanel = getPanelSnapshot('terminal');
  const explorerPanel = getPanelSnapshot('explorer');

  if (!isReady) {
    return (
      <div className="app">
        <div className="loading">Loading Ghost Shell...</div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="title-bar">
        <div className="title-bar-content">
          <span className="title">👻 Ghost Shell Demo --- More details at: <a href="https://github.com/andreyantipov/ghost-shell" target="_blank">ghost-shell</a></span>
          <div className="title-bar-actions">
            <a 
              href="https://github.com/andreyantipov/ghost-shell" 
              target="_blank" 
              rel="noopener noreferrer"
              className="github-link"
              title="View on GitHub"
            >
              <svg height="20" width="20" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
              </svg>
              Star on GitHub
            </a>
            <button onClick={handleAddPanel} className="title-bar-button">
              ➕ Add Panel
            </button>
          </div>
        </div>
      </div>
      
      <div className="main-container">
        <div className="activity-bar">
          <div className="activity-item active" title="Explorer">📁</div>
          <div className="activity-item" title="Search">🔍</div>
          <div className="activity-item" title="Source Control">🌿</div>
          <div className="activity-item" title="Debug">🐛</div>
          <div className="activity-item" title="Extensions">📦</div>
        </div>
        
        <div className="sidebar">
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">EXPLORER</span>
            </div>
            {renderTabs('explorer', explorerPanel)}
            <div className="panel-content">
              {explorerPanel ? renderPanelContent('explorer') : <div className="empty-panel">Loading...</div>}
            </div>
          </div>
        </div>
        
        <div className="editor-area">
          <div className="editor-panel">
            {renderTabs('editor', editorPanel)}
            <div className="editor-content">
              {editorPanel ? renderPanelContent('editor') : <div className="empty-panel">Loading...</div>}
            </div>
          </div>
          
          <div className="terminal-panel">
            <div className="panel-header">
              <span className="panel-title">TERMINAL</span>
            </div>
            {renderTabs('terminal', terminalPanel)}
            <div className="terminal-content">
              {terminalPanel ? renderPanelContent('terminal') : <div className="empty-panel">Loading...</div>}
            </div>
          </div>
        </div>

        {/* Dynamic panels */}
        {Object.entries(panels).map(([panelId]) => {
          if (['editor', 'terminal', 'explorer'].includes(panelId)) return null;
          const panel = getPanelSnapshot(panelId);
          return (
            <div key={panelId} className="dynamic-panel">
              <div className="panel-header">
                <span className="panel-title">{panelId.toUpperCase()}</span>
                <button 
                  className="panel-close"
                  onClick={() => layoutManager.removePanel(panelId)}
                >
                  ×
                </button>
              </div>
              {renderTabs(panelId, panel)}
              <div className="panel-content">
                {renderPanelContent(panelId)}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="status-bar">
        <div className="status-bar-left">
          {statusBar?.context.items
            .filter((item: StatusBarItem) => item.position === 'left')
            .map((item: StatusBarItem) => (
              <span key={item.id} className="status-item">
                {item.text}
              </span>
            ))}
          <span className="status-item">{statusBar?.context.statusText}</span>
        </div>
        <div className="status-bar-right">
          {statusBar?.context.items
            .filter((item: StatusBarItem) => item.position === 'right')
            .map((item: StatusBarItem) => (
              <span key={item.id} className="status-item">
                {item.text}
              </span>
            ))}
        </div>
      </div>
    </div>
  );
};