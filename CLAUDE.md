# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Agent Switch is a TUI (Text User Interface) tool for switching between different AI Agent framework configurations. Currently supports Claude Code, with planned support for GitHub Copilot, Gemini CLI, and other agent frameworks. It allows users to manage and switch between official services and custom API endpoints (like AnyRouter, DeepSeek, GLM, etc.).

The tool operates in two modes:
- **TUI mode**: Interactive terminal UI for browsing and managing services
- **CLI mode**: Quick command-line operations without UI

## Development Commands

```bash
# Development mode (runs TypeScript directly with tsx)
npm run dev

# Build the CLI (outputs to dist/index.mjs)
npm run build

# Type checking (no output files)
npm run typecheck

# Run built version
npm start
# or
node dist/index.mjs
```

## Testing

```bash
# Test TUI mode
agent-switch
# or
node dist/index.mjs

# Test CLI commands
agent-switch list
agent-switch use anyrouter --local
agent-switch current

# Or using node directly
node dist/index.mjs list
node dist/index.mjs use anyrouter --local
node dist/index.mjs current
```

See TEST.md for detailed testing procedures, especially for the service switching flow.

## Configuration Files

The tool reads/writes three types of configuration files:

1. **Presets** (`~/.claude/presets.json`): All available service configurations
2. **Global settings** (`~/.claude/settings.json`): Active global configuration
3. **Local settings** (`./.claude/settings.local.json`): Project-specific configuration

### Configuration Merge Strategy

When switching services, the tool uses a deep merge strategy (see `src/utils/deepMerge.ts`):
- For the `claudeai` official service: **removes** all `ANTHROPIC_*` env vars from settings
- For custom services: **deep merges** the preset's env vars into settings
- Always sets `currentPreset` field to track the active service ID

### Scope Selection

The TUI allows switching scope with Tab key:
- **Global scope** (`~/.claude/settings.json`): Affects all projects
- **Local scope** (`./.claude/settings.local.json`): Project-specific, overrides global
- Default selection is global; press Tab to toggle before pressing Enter

## Architecture

### Core Logic (`src/core/`)

- **presets.ts**: `PresetsManager` class handles CRUD operations for service presets
- **switcher.ts**: `ServiceSwitcher` class handles configuration file updates and service activation
- **types.ts**: Zod schemas and TypeScript types for runtime validation
- **instances.ts**: Singleton instances of managers (shared across CLI and TUI)

### UI Components (`src/components/`)

Built with Ink (React for CLI):
- **App.tsx**: Main application orchestrator with state machine for different modes (`list`, `add`, `edit`, `delete`, `switching`)
- **ServiceList.tsx**: Displays available services with navigation
- **ServiceDetail.tsx**: Shows detailed information about the selected service
- **AddServiceForm.tsx** / **EditServiceForm.tsx**: Multi-step forms for service management
- **ConfigDisplay.tsx**: Shows current global and local configurations after switching
- **StatusBar.tsx**: Displays keyboard shortcuts and current scope selection
- **Header.tsx**: Application title and branding

### Entry Points

- **index.tsx**: Main entry point, decides between TUI and CLI mode based on arguments
- **cli.ts**: Commander-based CLI with commands: `switch`, `use`, `list`, `current`

### State Management Pattern

The TUI uses React hooks for state management:
- `usePresets()`: Manages preset loading/CRUD operations
- `useServiceSwitch()`: Handles service switching logic
- Component-local state for UI modes and selections

The app uses a mode-based state machine: `list` → `switching` → exit

### Important Implementation Details

1. **Service Switching Flow**:
   - User navigates list with ↑↓ → optionally presses Tab to toggle scope (global/local) → presses Enter to switch
   - After switching: shows success message with `ConfigDisplay` → waits for any key press → exits
   - Uses `isExiting` flag to freeze UI during exit sequence and prevent keyboard input
   - Keyboard shortcuts in list mode:
     - `↑↓`: Navigate services
     - `Tab`: Toggle scope (global ↔ local)
     - `Enter`: Switch to selected service with current scope
     - `E`: Open presets.json in editor
     - `H`: Open help URL in browser
     - `Q`/`Esc`: Exit

2. **Official Service Handling**:
   - The `claudeai` service is special: it clears API-related env vars instead of setting them
   - Official services cannot be deleted
   - Detection: `forceLoginMethod === 'claudeai'`

3. **Token Masking**:
   - Tokens are masked in UI as `xxx...xxx` (first 8 + last 6 chars)
   - See `PresetsManager.maskToken()` in `src/core/presets.ts:144`

4. **Path Resolution**:
   - Uses `@/*` path alias mapping to `src/*` (configured in tsconfig.json)
   - All file operations use Node.js `path.join()` for cross-platform compatibility

## Build Process

The build script (`scripts/build.ts`) uses esbuild:
- Entry: `src/index.tsx` → Output: `dist/index.mjs`
- Platform: Node.js 18+, ESM format
- Externals: ink, react, ink-*, chalk, commander, zod (not bundled, expected as dependencies)
- Adds shebang `#!/usr/bin/env node` and makes output executable with chmod 0o755
- Generates source maps for debugging

## Utility Modules

### Key Utilities (`src/utils/`)

- **deepMerge.ts**: Deep merge algorithm for configuration objects
  - Recursively merges nested objects
  - Arrays and primitives are replaced (not merged)
  - Used by `ServiceSwitcher` to merge preset configs into settings
- **openInEditor.ts**: Opens files in system default editor
- **openInBrowser.ts**: Opens URLs in default browser
- **formatters.ts**: Text formatting utilities for TUI display
- **configFormatter.ts**: Formats configuration data for display

### Constants (`src/constants/`)

- **config.ts**: File paths, env var names, token masking config, UI config (delays, URLs)
- **theme.ts**: Color scheme and icons for TUI (using chalk colors)

## Code Style Notes

- TypeScript with `strict: false` (allows some flexibility)
- React functional components with hooks
- Async/await for all file operations
- Zod schemas for runtime validation of config files
- Error messages in Chinese (user-facing)
- Comments in Chinese

## Common Development Patterns

### Adding a New Service Type

1. Update `PresetSchema` in `src/core/types.ts` if new fields are needed
2. Modify `ServiceSwitcher.buildPresetConfig()` to handle the new service type
3. Update `PresetsManager.getServiceList()` to display new service properties
4. Add UI handling in `ServiceDetail.tsx` if needed

### Modifying Configuration Behavior

The configuration merge logic is centralized in:
- `src/core/switcher.ts`: `ServiceSwitcher.updateSettings()` method
- `src/utils/deepMerge.ts`: Deep merge implementation

When changing how configs are merged, ensure both global and local scopes are tested.
