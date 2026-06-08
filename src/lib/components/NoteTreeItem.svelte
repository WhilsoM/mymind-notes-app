<script lang="ts">
  import NoteTreeItem from "./NoteTreeItem.svelte";
  import type { FileNode } from "$lib/types/workspace";
  import { notes } from "$lib/stores/notes.store";
  import { ui } from "$lib/stores/ui.store";

  interface Props {
    node: FileNode;
    depth?: number;
    activePath?: string | null;
  }

  let { node, depth = 0, activePath = null }: Props = $props();

  let expanded = $derived(!$ui.collapsedPaths.has(node.path));
  let isRenaming = $derived($ui.renamingPath === node.path);
  let isSelected = $derived($ui.selectedPath === node.path);
  let renameValue = $state("");

  $effect(() => {
    if (isRenaming) renameValue = node.name.replace(/\.md$/, "");
  });

  function handleClick() {
    ui.selectPath(node.path);
    if (node.kind === "dir") {
      expanded ? ui.collapseDir(node.path) : ui.expandDir(node.path);
      return;
    }
    notes.open(node.path).catch((e: Error) => ui.toast(e.message, "error"));
  }

  function handleKeydown(e: KeyboardEvent) {
    // Enter = rename (no modifier)
    if (e.key === "Enter" && !e.metaKey && !e.ctrlKey && !e.altKey) {
      e.preventDefault();
      ui.startRename(node.path);
    }
    // Cmd+Backspace = delete (macOS delete key sends Backspace)
    if ((e.metaKey || e.ctrlKey) && (e.key === "Backspace" || e.key === "Delete")) {
      e.preventDefault();
      ui.confirmDeleteNote(node.path, node.name.replace(/\.md$/, ""));
    }
  }

  function handleContextMenu(e: MouseEvent) {
    e.preventDefault();
    ui.selectPath(node.path);
    ui.showContextMenu(e.clientX, e.clientY, node);
  }

  function handleRenameKeydown(e: KeyboardEvent) {
    if (e.key === "Enter") confirmRename();
    if (e.key === "Escape") ui.stopRename();
  }

  function confirmRename() {
    if (!renameValue.trim()) { ui.stopRename(); return; }
    notes
      .rename(node.path, renameValue.trim())
      .then(() => { ui.stopRename(); ui.toast("Renamed", "success"); })
      .catch((e: Error) => { ui.toast(e.message, "error"); ui.stopRename(); });
  }
</script>

<div
  class="tree-item"
  class:is-dir={node.kind === "dir"}
  class:is-active={node.path === activePath}
  class:is-selected={isSelected && node.path !== activePath}
  style:padding-left="{12 + depth * 14}px"
>
  {#if isRenaming}
    <input
      class="tree-item__rename"
      bind:value={renameValue}
      onkeydown={handleRenameKeydown}
      onblur={confirmRename}
      autofocus
    />
  {:else}
    <button
      class="tree-item__btn"
      onclick={handleClick}
      onkeydown={handleKeydown}
      oncontextmenu={handleContextMenu}
      type="button"
    >
      {#if node.kind === "dir"}
        <span class="tree-item__chevron" class:is-open={expanded}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 2l4 3-4 3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
        <span class="tree-item__icon tree-item__icon--dir">
          <svg width="14" height="12" viewBox="0 0 14 12" fill="none">
            <path d="M1 2.5A1.5 1.5 0 012.5 1h3.17a1.5 1.5 0 011.06.44l.83.83A1.5 1.5 0 008.62 3H11.5A1.5 1.5 0 0113 4.5v5A1.5 1.5 0 0111.5 11h-9A1.5 1.5 0 011 9.5v-7z" stroke="currentColor" stroke-width="1.2" fill="none"/>
          </svg>
        </span>
      {:else}
        <span class="tree-item__icon tree-item__icon--file">
          <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
            <path d="M2 1h6l3 3v9a1 1 0 01-1 1H2a1 1 0 01-1-1V2a1 1 0 011-1z" stroke="currentColor" stroke-width="1.2" fill="none"/>
            <path d="M7 1v3h3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
          </svg>
        </span>
      {/if}
      <span class="tree-item__name">
        {node.kind === "file" ? node.name.replace(/\.md$/, "") : node.name}
      </span>
    </button>
  {/if}
</div>

{#if node.kind === "dir" && expanded && node.children}
  {#each node.children as child (child.path)}
    <NoteTreeItem node={child} depth={depth + 1} {activePath} />
  {/each}
{/if}

<style>
  .tree-item { position: relative; }

  .tree-item__btn {
    display: flex;
    align-items: center;
    gap: var(--space-1);
    width: 100%;
    height: 28px;
    background: transparent;
    border: none;
    cursor: pointer;
    text-align: left;
    border-radius: var(--radius-sm);
    padding-right: var(--space-3);
    transition: background var(--transition);
    color: var(--text-muted);
  }

  .tree-item__btn:hover {
    background: var(--surface-hover);
    color: var(--text);
  }

  .tree-item.is-active .tree-item__btn {
    background: var(--surface-active);
    color: var(--accent-text);
  }

  .tree-item.is-selected .tree-item__btn {
    background: var(--surface-hover);
    color: var(--text);
  }

  .tree-item__chevron {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 14px;
    flex-shrink: 0;
    transition: transform var(--transition);
    color: var(--text-faint);
  }

  .tree-item__chevron.is-open { transform: rotate(90deg); }

  .tree-item__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    flex-shrink: 0;
  }

  .tree-item__icon--dir { color: var(--accent); opacity: 0.7; }
  .tree-item__icon--file { color: var(--text-faint); }
  .tree-item.is-active .tree-item__icon--file { color: var(--accent-text); opacity: 0.8; }

  .tree-item__name {
    font-size: var(--font-size-sm);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .tree-item__rename {
    width: calc(100% - var(--space-2));
    height: 26px;
    background: var(--surface-strong);
    border: 1.5px solid var(--accent);
    border-radius: var(--radius-xs);
    font-size: var(--font-size-sm);
    font-family: var(--font-sans);
    color: var(--text);
    padding: 0 var(--space-2);
    outline: none;
    margin: 1px 0;
    user-select: text;
  }
</style>
