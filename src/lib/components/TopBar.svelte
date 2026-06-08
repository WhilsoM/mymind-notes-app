<script lang="ts">
  import { notes } from "$lib/stores/notes.store";
  import { ui } from "$lib/stores/ui.store";
  import IconButton from "./IconButton.svelte";

  let currentNote = $derived($notes.note);
  let isDirty = $derived($notes.isDirty);
  let isSaving = $derived($notes.isSaving);
  let previewMode = $derived($ui.previewMode);
</script>

<header class="topbar" data-tauri-drag-region>
  <!-- Left: sidebar toggle — drag region so empty padding is draggable -->
  <div class="topbar__left" data-tauri-drag-region>
    <IconButton label="Toggle sidebar" onclick={() => ui.toggleSidebar()}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="3" width="14" height="1.5" rx="0.75" fill="currentColor"/>
        <rect x="1" y="7.25" width="14" height="1.5" rx="0.75" fill="currentColor"/>
        <rect x="1" y="11.5" width="14" height="1.5" rx="0.75" fill="currentColor"/>
      </svg>
    </IconButton>
  </div>

  <!-- Center: the primary drag region (mostly empty) -->
  <div class="topbar__center" data-tauri-drag-region>
    {#if currentNote}
      <span class="topbar__title" data-tauri-drag-region>
        {currentNote.name}
        {#if isDirty}<span class="topbar__dirty" title="Unsaved changes">•</span>{/if}
        {#if isSaving}<span class="topbar__saving">saving…</span>{/if}
      </span>
    {/if}
  </div>

  <!-- Right: preview toggle + settings -->
  <div class="topbar__right" data-tauri-drag-region>
    {#if currentNote}
      <IconButton label="Toggle preview" active={previewMode} onclick={() => ui.togglePreview()}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" stroke-width="1.4" fill="none"/>
          <circle cx="8" cy="8" r="2" stroke="currentColor" stroke-width="1.4" fill="none"/>
        </svg>
      </IconButton>
    {/if}
    <IconButton label="Settings (⌘,)" onclick={() => ui.openSettings()}>
      <!-- Feather Icons "settings" gear -->
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
    </IconButton>
  </div>
</header>

<style>
  .topbar {
    height: var(--topbar-height);
    display: flex;
    align-items: center;
    padding: 0 var(--space-3);
    border-bottom: 1px solid var(--border);
    background: var(--surface-strong);
    flex-shrink: 0;
    /* macOS traffic lights space */
    padding-left: 80px;
  }

  .topbar__left,
  .topbar__right {
    display: flex;
    align-items: center;
    gap: var(--space-1);
    flex: 1;
  }

  .topbar__right {
    justify-content: flex-end;
  }

  .topbar__center {
    flex: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 0;
  }

  .topbar__title {
    font-size: var(--font-size-sm);
    font-weight: 500;
    color: var(--text-muted);
    display: flex;
    align-items: center;
    gap: var(--space-2);
    max-width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .topbar__dirty {
    color: var(--accent);
    font-size: 18px;
    line-height: 1;
    flex-shrink: 0;
  }

  .topbar__saving {
    font-size: var(--font-size-xs);
    color: var(--text-faint);
    font-style: italic;
  }
</style>
