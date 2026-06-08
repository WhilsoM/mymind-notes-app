# mymind-notes-app

A lightweight, beautiful, minimalist desktop notes app for macOS built with Tauri 2, Rust, and Svelte.

> Open your markdown folder. Write. That's it.

---

## What is this?

mymind-notes-app is a desktop app that opens any folder containing `.md` files — including an Obsidian vault — and lets you browse, create, edit, rename, and delete markdown notes through a clean, Apple-like interface.

It does **not** import your notes into a database. It does **not** copy your files. It reads and writes directly to your files on disk. Your vault stays yours.

---

## Goals

- Zero-friction markdown editing
- Obsidian-compatible (opens any `.md` folder)
- Extremely low memory footprint
- Beautiful, calm, premium macOS UI
- No database. No vendor lock-in. No bloat.

---

## Stack

| Layer | Technology |
|---|---|
| Desktop shell | Tauri 2 |
| Backend / FS | Rust |
| Frontend | Svelte + TypeScript |
| Bundler | Vite |
| Styling | Plain CSS + CSS variables |
| State | Svelte stores |

---

## Why not Electron?

Electron bundles a full copy of Chromium (~150 MB) with every app. Tauri uses the OS's native WebView (WKWebView on macOS), resulting in:

- App binary ~10–15 MB vs 150+ MB
- RAM usage 3–5× lower
- Faster startup
- Better system integration

---

## Why no database?

Your notes already exist as files. Adding a database would mean:

1. Duplicating data (files + DB)
2. Syncing them — which is a constant source of bugs
3. Risking stale data when you edit files outside the app
4. Adding ~3–5 MB to the binary for SQLite

Notes are plain `.md` files. That's the database. iCloud, Dropbox, and Git sync them for free.

---

## Why .md files as source of truth?

- Open any note in any other editor — they're just text files
- No migration needed when you update the app
- Works with any sync service
- Your Obsidian vault stays untouched
- Zero vendor lock-in

---

## Roadmap

### MVP (current)
- [x] Project setup
- [ ] Open workspace folder
- [ ] Recursive file tree
- [ ] Open and edit notes
- [ ] Autosave with debounce
- [ ] Create / rename / delete notes
- [ ] Light + dark + system theme
- [ ] Custom accent color
- [ ] Compact mode
- [ ] Zen Browser-like sidebar
- [ ] Settings page
- [ ] Hotkeys

### Post-MVP
- [ ] Full-text search
- [ ] Markdown preview
- [ ] Tags
- [ ] Quick note switcher (Cmd+P)
- [ ] Windows + Linux support

---

## Requirements

Before running the app, make sure you have:

### Node.js
```bash
node -v   # v18 or higher
npm -v    # v9 or higher
```

Download: https://nodejs.org

### Rust + Cargo
```bash
rustc --version   # 1.77+
cargo --version   # 1.77+
```

**Install Rust** (if not installed):
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Then restart your terminal and verify:
```bash
source $HOME/.cargo/env
rustc --version
cargo --version
```

### Xcode Command Line Tools (macOS)
```bash
xcode-select -p   # should return a path
```

If not installed:
```bash
xcode-select --install
```

### pnpm
```bash
npm install -g pnpm
pnpm -v
```

---

## Environment check

Run this to verify your environment:

```bash
node -v
npm -v
rustc --version
cargo --version
xcode-select -p
```

Expected output:
```
v22.x.x
10.x.x
rustc 1.77.x
cargo 1.77.x
/Library/Developer/CommandLineTools
```

---

## Running in development

```bash
# Install dependencies
pnpm install

# Start dev mode (hot reload)
pnpm tauri dev
```

> **Note:** The first run downloads and compiles Rust dependencies. This may take 2–5 minutes.

---

## Building the app

```bash
pnpm tauri build
```

Output will be in `src-tauri/target/release/bundle/`.

---

## Quick checks (without full build)

```bash
# TypeScript + Svelte check
pnpm check

# Rust check (no full compile)
cd src-tauri && cargo check
```

---

## MVP limitations

- macOS only (Windows/Linux in roadmap)
- No full-text search in vault
- No markdown preview in first release
- No tags or backlinks
- No sync — use iCloud/Dropbox/Git directly on your vault folder

---

## Screenshots

*Coming soon.*

---

## License

MIT
