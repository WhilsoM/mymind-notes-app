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

### Bun
```bash
bun -v   # v1.1 or higher
```

Install: https://bun.sh

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

---

## Environment check

Run this to verify your environment:

```bash
bun -v
rustc --version
cargo --version
xcode-select -p
```

Expected output:
```
1.x.x
rustc 1.77.x
cargo 1.77.x
/Library/Developer/CommandLineTools
```

---

## Running in development

```bash
# Install dependencies
bun install

# Start dev mode (hot reload)
bun run tauri dev
```

> **Note:** The first run downloads and compiles Rust dependencies. This may take 2–5 minutes.

---

## Building the app

```bash
bun run tauri build
```

Output will be in `src-tauri/target/release/bundle/`.

---

## Quick checks (without full build)

```bash
# TypeScript + Svelte check
bun run check

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

## Releases / CI/CD

Releases are built automatically by GitHub Actions on every push to `main`.

### How it works

| Event | Action |
|---|---|
| Push to `main` | Build for macOS (ARM + Intel), Windows, Linux → publish to GitHub Releases |
| `workflow_dispatch` | Same, triggered manually from the Actions tab |

### Downloading a build

1. Go to the **[Releases](https://github.com/WhilsoM/mymind-notes-app/releases)** page on GitHub.
2. Find the latest pre-release tagged `main-<build-number>`.
3. Download the artifact for your platform:
   - **macOS** → `.dmg`
   - **Windows** → `.exe` or `.msi`
   - **Linux** → `.AppImage` or `.deb`

### Important — builds are unsigned

Current builds are **not code-signed or notarized**.

- **macOS**: If you see *"can't be opened because Apple cannot check it for malicious software"*, right-click the app in Finder and choose **Open**, then confirm.
- **Windows**: SmartScreen may show a warning — click **More info → Run anyway**.

Signing and notarization will be added in a future release.

---

## License

MIT
