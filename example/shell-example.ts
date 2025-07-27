import { LayoutManager } from "~/layout-manager/LayoutManager";

class ShellUI {
  private layoutManager: LayoutManager;
  private panelIdCounter = 0;
  private tabIdCounter = 0;

  constructor() {
    this.layoutManager = new LayoutManager();

    // Subscribe to shell changes
    this.layoutManager.subscribe(() => {
      console.log("Shell state changed, triggering render");
      this.render();
    });

    this.setupEventListeners();
    this.render();
    this.demonstrateStatusBar();
  }

  private setupEventListeners() {
    // Add panel button
    document.getElementById("add-panel")?.addEventListener("click", () => {
      this.addPanel();
    });
  }

  private addPanel() {
    const panelId = `panel-${++this.panelIdCounter}`;
    console.log(`Adding panel: ${panelId}`);
    this.layoutManager.addPanel(panelId);
  }

  private addTab(panelId: string) {
    const tabId = `tab-${++this.tabIdCounter}`;
    const title = `Tab ${this.tabIdCounter}`;
    console.log(`Adding tab ${tabId} to panel ${panelId}`);
    this.layoutManager.addTab(panelId, tabId, title);
  }

  private removePanel(panelId: string) {
    this.layoutManager.removePanel(panelId);
  }

  private removeTab(panelId: string, tabId: string) {
    this.layoutManager.removeTab(panelId, tabId);
  }

  private activateTab(panelId: string, tabId: string) {
    this.layoutManager.activateTab(panelId, tabId);
  }

  private render() {
    console.log("Render called");
    const state = this.layoutManager.getSnapshot();
    console.log("Current shell state:", state.context);
    const panelsContainer = document.getElementById("panels-container");

    if (!panelsContainer) {
      console.error("panels-container element not found!");
      return;
    }

    // Update status bar
    this.updateStatusBar(state);
    this.renderStatusBar();

    // Clear and render panels
    panelsContainer.innerHTML = "";

    if (state.context.panels.length === 0) {
      panelsContainer.innerHTML = `
        <div class="empty-state">
          <h3>No panels open</h3>
          <p>Click "Add Panel" to create a new panel</p>
        </div>
      `;
      return;
    }

    // Render each panel
    state.context.panels.forEach((panelId) => {
      const panelSnapshot = this.layoutManager.getPanelSnapshot(panelId);
      if (panelSnapshot) {
        const panelElement = this.createPanelElement(panelId, panelSnapshot);
        panelsContainer.appendChild(panelElement);
      }
    });
  }

  private createPanelElement(panelId: string, panelSnapshot: any): HTMLElement {
    const panel = document.createElement("div");
    panel.className = "panel";
    panel.dataset.panelId = panelId;

    // Panel header
    const header = document.createElement("div");
    header.className = "panel-header";

    const title = document.createElement("div");
    title.className = "panel-title";
    title.textContent = panelId;

    const actions = document.createElement("div");
    actions.className = "panel-actions";

    // Add tab button
    const addTabBtn = document.createElement("button");
    addTabBtn.className = "icon-btn";
    addTabBtn.innerHTML = "+";
    addTabBtn.title = "Add new tab";
    addTabBtn.onclick = () => this.addTab(panelId);

    // Close panel button
    const closePanelBtn = document.createElement("button");
    closePanelBtn.className = "icon-btn";
    closePanelBtn.innerHTML = "×";
    closePanelBtn.title = "Close panel";
    closePanelBtn.onclick = () => this.removePanel(panelId);

    actions.appendChild(addTabBtn);
    actions.appendChild(closePanelBtn);
    header.appendChild(title);
    header.appendChild(actions);

    // Tabs container
    const tabsContainer = document.createElement("div");
    tabsContainer.className = "tabs-container";

    if (panelSnapshot.context.tabs.length > 0) {
      panelSnapshot.context.tabs.forEach((tabId: string) => {
        // Get tab actor to access tab title
        const tabActor = panelSnapshot.context.tabActors[tabId];
        const tabTitle = tabActor?.getSnapshot?.()?.context?.title || tabId;

        const tab = this.createTabElement(
          panelId,
          tabId,
          tabTitle,
          tabId === panelSnapshot.context.activeTab
        );
        tabsContainer.appendChild(tab);
      });
    }

    // Panel content
    const content = document.createElement("div");
    content.className = "panel-content";

    if (panelSnapshot.context.tabs.length === 0) {
      content.innerHTML = `
        <div class="empty-state">
          <h3>No tabs open</h3>
          <p>Click "+" to add a new tab</p>
        </div>
      `;
    } else if (panelSnapshot.context.activeTab) {
      content.innerHTML = `
        <div>
          <h3>Active Tab: ${panelSnapshot.context.activeTab}</h3>
          <p>Tab content would go here...</p>
          <pre>${JSON.stringify(panelSnapshot.context, null, 2)}</pre>
        </div>
      `;
    }

    panel.appendChild(header);
    panel.appendChild(tabsContainer);
    panel.appendChild(content);

    return panel;
  }

  private createTabElement(
    panelId: string,
    tabId: string,
    title: string,
    isActive: boolean
  ): HTMLElement {
    const tab = document.createElement("div");
    tab.className = isActive ? "tab active" : "tab";
    tab.dataset.tabId = tabId;

    const tabTitle = document.createElement("span");
    tabTitle.className = "tab-title";
    tabTitle.textContent = title;
    tabTitle.onclick = () => this.activateTab(panelId, tabId);

    const closeBtn = document.createElement("button");
    closeBtn.className = "tab-close";
    closeBtn.innerHTML = "×";
    closeBtn.onclick = (e) => {
      e.stopPropagation();
      this.removeTab(panelId, tabId);
    };

    tab.appendChild(tabTitle);
    tab.appendChild(closeBtn);

    return tab;
  }

  private updateStatusBar(state: any) {
    const panelCount = document.getElementById("panel-count");
    const tabCount = document.getElementById("tab-count");

    if (panelCount) {
      const count = state.context.panels.length;
      panelCount.textContent = `${count} panel${count !== 1 ? "s" : ""}`;
    }

    if (tabCount) {
      let totalTabs = 0;
      state.context.panels.forEach((panelId: string) => {
        const panelSnapshot = this.layoutManager.getPanelSnapshot(panelId);
        if (panelSnapshot) {
          totalTabs += panelSnapshot.context.tabs.length;
        }
      });
      tabCount.textContent = `${totalTabs} tab${totalTabs !== 1 ? "s" : ""}`;
    }
  }

  private renderStatusBar() {
    const statusBarSnapshot = this.layoutManager.getStatusBarSnapshot();
    if (!statusBarSnapshot) {
      return;
    }

    const statusBar = document.querySelector(".status-bar");
    if (!statusBar) {
      return;
    }

    // Clear existing dynamic items (keep panel-count and tab-count)
    const dynamicItems = statusBar.querySelectorAll(".status-item.dynamic");
    dynamicItems.forEach(item => item.remove());

    // Add status text if different from default
    if (statusBarSnapshot.context.status !== "Ready") {
      const statusItem = document.createElement("div");
      statusItem.className = "status-item dynamic";
      statusItem.innerHTML = `<span>${statusBarSnapshot.context.status}</span>`;
      statusBar.insertBefore(statusItem, statusBar.firstChild);
    }

    // Add custom status bar items
    statusBarSnapshot.context.items.forEach((item: any) => {
      const statusItem = document.createElement("div");
      statusItem.className = "status-item dynamic";
      if (item.onClick) {
        statusItem.style.cursor = "pointer";
        statusItem.onclick = item.onClick;
      }
      if (item.tooltip) {
        statusItem.title = item.tooltip;
      }
      statusItem.innerHTML = `<span>${item.text}</span>`;
      statusBar.appendChild(statusItem);
    });
  }

  private demonstrateStatusBar() {
    // Update status text
    this.layoutManager.updateStatusBarText("Loading...");
    
    // Add some custom status bar items
    this.layoutManager.addStatusBarItem({
      id: "mode",
      text: "🎨 Design Mode",
      priority: 10,
      tooltip: "Click to toggle mode",
      onClick: () => {
        console.log("Mode clicked!");
        this.layoutManager.updateStatusBarText("Mode changed");
        setTimeout(() => {
          this.layoutManager.updateStatusBarText("Ready");
        }, 2000);
      }
    });

    this.layoutManager.addStatusBarItem({
      id: "user",
      text: "👤 User: Demo",
      priority: 5,
      tooltip: "Current user"
    });

    // Simulate async operation
    setTimeout(() => {
      this.layoutManager.updateStatusBarText("Ready");
    }, 2000);
  }
}

// Initialize the UI when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => new ShellUI());
} else {
  new ShellUI();
}
