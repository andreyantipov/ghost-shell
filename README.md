# 👻 Ghost Shell

> 🚧 **Work in Progress** - This project is under active development. Nothing is stable yet! 🚧

A headless UI layout manager for building modular, dockable web interfaces powered by XState. Create VSCode-like layouts with panels, tabs, and widgets - fully customizable and framework-agnostic.

## Features

- 🎯 **State-driven architecture** - Built on XState for predictable, declarative UI state management
- 🧩 **Modular widgets** - Panels, tabs, status bars, and more as composable building blocks
- 🎨 **Headless by design** - Bring your own styles or use pre-built design presets
- 🔌 **Framework agnostic** - Works with React, Vue, vanilla JS, or any framework
- 📦 **TypeScript first** - Full type safety and excellent DX

## Quick Start

⚠️ **Not published to npm yet!** For now, clone and explore the demo.

```bash
# Clone the repo
git clone https://github.com/andreyantipov/ghost-shell.git
cd ghost-shell
npm install
nx serve react-demo
```

Future installation (when published):
```bash
npm install @ghost-shell/core @ghost-shell/widgets
```

```typescript
import { LayoutManager } from '@ghost-shell/core';

const layout = new LayoutManager();

// Add panels and tabs
layout.addPanel('editor');
layout.addTab('editor', 'file1', 'index.ts');
layout.activateTab('editor', 'file1');

// Subscribe to changes
layout.subscribe(() => {
  console.log('Layout updated:', layout.getSnapshot());
});
```

## Demo

Check out the [live demo](https://andreyantipov.github.io/ghost-shell/) to see Ghost Shell in action.

## Development

This is an Nx monorepo with the following packages:

- `@ghost-shell/core` - Core layout manager
- `@ghost-shell/widgets` - Widget collection (panels, tabs, status bar)
- `react-demo` - Example React application

```bash
# Install dependencies
npm install

# Run the demo
nx serve react-demo

# Build all packages
nx run-many --target=build
```

## License

MIT