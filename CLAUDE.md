# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Injectio is a lightweight React library that enables summoning React components on demand with a simple function call. The core API allows injecting components globally using `inject(<Component />)`.

## Repository Structure

This is a monorepo using pnpm workspaces and Turborepo:
- `/lib/react/` - Core Injectio React library
- `/examples/react/` - React example application demonstrating usage
- `/packages/` - Shared workspace packages (configs, utils)

## Key Commands

### Development
- `pnpm dev` - Start all development servers
- `pnpm build` - Build all packages
- `pnpm test:workspace` - Run all tests
- `pnpm test:workspace:watch` - Run tests in watch mode

### Code Quality
- `pnpm lint` - Lint all packages
- `pnpm lint:fix` - Fix linting issues
- `pnpm format` - Check formatting
- `pnpm format:fix` - Fix formatting
- `pnpm check-types` - TypeScript type checking

### Package-Specific Commands
For individual packages (lib/react, examples/react):
- `pnpm test` - Run package tests
- `pnpm test:watch` - Run tests in watch mode
- `pnpm lint` - Lint package
- `pnpm build` - Build package

## Core Architecture

### Main Library (`/lib/react/`)
- **`inject()`** - Core function to summon components globally
- **`<Injectio />`** - Provider component that renders injected items
- **`InjectioObserver`** - Singleton managing the global injection state
- **`useInjectedItems()`** - Hook providing access to injected items

### Key Design Patterns
- Uses observer pattern for global state management
- Each injected item receives `dismiss`, `dismissed`, `remove`, and `resolve` functions
- Components can be stacked or replaced based on dismissal behavior
- Supports promise-based workflows for component resolution

### Testing
- Uses Vitest with React Testing Library
- Workspace-level test configuration in `vitest.workspace.ts`
- Individual packages have their own test configurations

## Package Manager

This project uses pnpm with workspaces. Always use `pnpm` commands instead of npm or yarn.