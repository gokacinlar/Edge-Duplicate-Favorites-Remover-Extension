# Agents Documentation

This document describes how agents (AI assistants) should interact with this codebase.

## Project Overview

This is a Microsoft Edge browser extension built with:

- TypeScript
- Web Components (custom elements)
- Webpack for bundling
- SCSS for styling
- Bootstrap 5 for UI components

## Key Conventions

### 1. File Organization

```text
src/
├── app/              # Main application root component
├── components/       # Reusable Web Components
│   ├── Layout/      # Layout components (Navbar)
│   └── Misc/        # Utility components (Button, Dropdown)
├── assets/          # Static assets (images, fonts, scss)
├── _locales/         # Translation files for i18n
├── services/        # Chrome API wrappers (bookmarkService)
├── ts/              # TypeScript types and interfaces
├── utils/           # Utility functions
├── i18n.ts          # i18next internationalization setup
├── main.ts          # Application entry point
└── worker.ts        # Service worker entry point
```

### 2. Web Components Pattern

All UI components extend `HTMLElement` and implement `LifecycleCallbacks`:

```typescript
import type { LifecycleCallbacks } from "../../ts/interfaces/iFaces";
import CreateTemplate from "../../utils/componentLogic";

class MyComponent extends HTMLElement implements LifecycleCallbacks {
    constructor() {
        super();
        new CreateTemplate().initializeComponent(MyComponent.layout(), this);
    }

    private static layout(): string {
        return /*html*/`...`;
    }

    connectedCallback(): void { }
    attributeChangedCallback(): void { }
    disconnectedCallback(): void { }
}

export default MyComponent;
customElements.define("my-component", MyComponent);
```

### 3. Styling

- Use Bootstrap 5 utility classes in HTML templates
- Custom styles in `src/assets/scss/index.scss`
- Bootstrap is loaded via npm and styles are compiled by webpack
- Theme switching is handled by `ThemeManager` (light/dark mode)

### 4. Building and Testing

```bash
npm run dev     # Development build with watch mode
npm run build   # Production build
npm run lint    # Run Biome linter
npm run lint:fix # Auto-fix linting issues
npm run test    # Run Jest tests
```

### 5. Chrome Extension Specifics

- Uses Manifest V3
- Entry points: `src/main.ts` and `src/worker.ts`
- Built files go to `public/` directory
- HTML templates in `src/pages/` and `src/popup/`

### 6. Adding New Components

1. Create component file in appropriate `src/components/` subdirectory
2. Use the Web Components pattern shown above
3. Export and register in `src/components/Components.ts`
4. Use in templates with kebab-case tag: `<my-component></my-component>`

### 7. Adding Dependencies

Before adding new npm packages:

1. Check if the functionality already exists in Bootstrap
2. Ensure the package supports tree-shaking if used partially
3. Verify the package is browser-compatible (not Node.js only)

## Code Style

- Use Biome for linting and formatting
- Follow existing patterns in the codebase
- Prefer composition over inheritance
- Use TypeScript types strictly
- No magic numbers - use constants
