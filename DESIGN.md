# Design Documentation

This document describes the design decisions and architecture of the Edge Duplicate Favorites Remover Extension.

## Overview

A Microsoft Edge browser extension that identifies and removes duplicate bookmarks (favorites) from the browser's bookmark store.

## Architecture

### Core Components

```text
┌─────────────────────────────────────────────────────────────┐
│                     app-root (Root.ts)                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                   app-navbar (Navbar.ts)              │   │
│  │   [Theme] [Language] [GitHub] [Support]             │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                  Display Area                         │   │
│  │   - Favorites list                                   │   │
│  │   - Duplicate indicators                             │   │
│  │   - Actions                                          │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                  Controls Area                        │   │
│  │   [Expand] [Tools] [Bulk Actions] [Get Favorites]   │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Services

#### BookmarkService

- Wraps Chrome `chrome.bookmarks` API
- Methods: `getAll()`, `getChildren()`, `remove()`, `search()`
- Handles bookmark tree operations

### State Management

- Uses Web Components' lifecycle for component state
- `ThemeManager` singleton for theme state (light/dark)
- Event-driven communication via CustomEvents

## UI/UX Decisions

### Color Scheme

- Primary: Bee yellow gradient (`#f0c74e` to `#f9df7b`)
- Used for buttons and interactive elements
- Provides warm, friendly appearance

### Typography

- Primary font: Vollkorn (serif, variable weight)
- Supports Turkish diacritics
- Loaded via WOFF2 for performance

### Layout

- Flexbox-based responsive layout
- Controls fixed at bottom (mobile-friendly)
- Scrollable display area for favorites list
- Dropdown menus for secondary actions

### Icons

- Remix Icons library
- Moon/sun for theme toggle
- Translate icon for language selection
- GitHub and coffee cup for links

## Internationalization (i18n)

### Supported Languages

| Code | Language | Status    |
| ---- | -------- | --------- |
| en   | English  | Primary   |
| tr   | Turkish  | Supported |
| de   | German   | Supported |
| fr   | French   | Supported |

### Translation File Structure

Translation files are stored in `src/_locales/{lang}/messages.json` following Chrome Extension i18n format:

```json
{
  "keyName": {
    "message": "Translated text",
    "description": "Context for translators"
  }
}
```

### Adding New Translations

1. Add translation keys to all locale files
2. Use the key in components via the i18n system
3. Follow the Chrome Extension i18n pattern

## Extension Structure

### Manifest V3

```json
{
  "manifest_version": 3,
  "name": "Duplicate Favorites Remover",
  "version": "1.0.0",
  "action": { ... },
  "permissions": ["bookmarks"],
  "background": { ... }
}
```

### Permissions

- `bookmarks` - Required for reading and managing favorites
- Host permissions not required (extension-only)

## Performance Considerations

- Web Components lazy initialization
- Tree-shaken imports for Bootstrap
- WOFF2 font format with subsetting
- CSS compiled and minified by Webpack

## Accessibility

- Semantic HTML elements
- ARIA attributes for interactive components
- Keyboard navigation support
- High contrast mode support via Bootstrap

## Future Considerations

1. **Empty folder detection** - Find and remove empty bookmark folders
2. **Folder comparison** - Find duplicate folders
3. **Export/Import** - Backup and restore favorites
4. **Sync support** - Edge sync integration
5. **Statistics** - Show bookmark usage patterns
