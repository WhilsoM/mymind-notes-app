<script lang="ts">
  import { workspace } from "$lib/stores/workspace.store";
  import { ui } from "$lib/stores/ui.store";

  function handleOpen() {
    workspace.open().catch((e: Error) => ui.toast(e.message, "error"));
  }
</script>

<div class="welcome" data-tauri-drag-region>
  <div class="welcome__inner">
    <div class="welcome__icon" aria-hidden="true">
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect x="4" y="10" width="40" height="32" rx="4" stroke="currentColor" stroke-width="2" fill="none"/>
        <path d="M4 18h40" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 3"/>
        <path d="M16 10V8a4 4 0 014-4h8a4 4 0 014 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M18 28h12M18 34h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </div>
    <h1 class="welcome__title">mymind</h1>
    <p class="welcome__desc">
      Open any folder with markdown files.<br>
      Your Obsidian vault works perfectly.
    </p>
    <button class="welcome__btn" onclick={handleOpen} type="button">
      Open folder
    </button>
    <p class="welcome__hint">or press <kbd>⌘O</kbd> anytime</p>
  </div>
</div>

<style>
  .welcome {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg);
    padding: var(--space-8);
  }

  .welcome__inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-4);
    text-align: center;
    max-width: 320px;
  }

  .welcome__icon {
    color: var(--accent);
    opacity: 0.6;
    margin-bottom: var(--space-2);
  }

  .welcome__title {
    font-size: 28px;
    font-weight: 600;
    color: var(--text);
    letter-spacing: -0.02em;
    margin: 0;
  }

  .welcome__desc {
    font-size: var(--font-size-sm);
    color: var(--text-muted);
    line-height: 1.6;
    margin: 0;
  }

  .welcome__btn {
    margin-top: var(--space-2);
    padding: 10px var(--space-6);
    background: var(--accent);
    color: #fff;
    border: none;
    border-radius: var(--radius-md);
    font-family: var(--font-sans);
    font-size: var(--font-size-md);
    font-weight: 500;
    cursor: pointer;
    transition: filter var(--transition);
  }

  .welcome__btn:hover {
    filter: brightness(1.1);
  }

  .welcome__hint {
    font-size: var(--font-size-xs);
    color: var(--text-faint);
    margin: 0;
  }

  kbd {
    font-family: var(--font-sans);
    background: var(--surface-strong);
    border: 1px solid var(--border);
    border-radius: var(--radius-xs);
    padding: 1px 5px;
    font-size: var(--font-size-xs);
  }
</style>
