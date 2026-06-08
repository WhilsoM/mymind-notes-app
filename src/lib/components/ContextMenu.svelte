<script lang="ts">
  import { ui } from "$lib/stores/ui.store";
  import { notes } from "$lib/stores/notes.store";
  import type { FileNode } from "$lib/types/workspace";

  interface Props {
    x: number;
    y: number;
    node: FileNode;
  }

  let { x, y, node }: Props = $props();

  // Adjust position so menu stays inside viewport
  let menuEl: HTMLElement | undefined = $state();
  let adjustedX = $state(0);
  let adjustedY = $state(0);

  $effect(() => {
    adjustedX = x;
    adjustedY = y;
    if (!menuEl) return;
    const rect = menuEl.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    if (x + rect.width > vw) adjustedX = x - rect.width;
    if (y + rect.height > vh) adjustedY = y - rect.height;
  });

  function close() {
    ui.hideContextMenu();
  }

  function handleRename() {
    close();
    ui.startRename(node.path);
  }

  async function handleDuplicate() {
    close();
    if (node.kind !== "file") return;
    const dir = node.path.split("/").slice(0, -1).join("/");
    const baseName = node.name.replace(/\.md$/, "");
    await notes.duplicate(node.path, dir, baseName + " copy").catch((e: Error) =>
      ui.toast(e.message, "error")
    );
    ui.toast("Duplicated", "success");
  }

  function handleDelete() {
    close();
    ui.confirmDeleteNote(node.path, node.name.replace(/\.md$/, ""));
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Escape") close();
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- invisible backdrop to catch outside clicks -->
<div class="ctx-backdrop" onclick={close} role="presentation"></div>

<menu
  class="ctx-menu"
  style:top="{adjustedY}px"
  style:left="{adjustedX}px"
  bind:this={menuEl}
  role="menu"
>
  <li role="menuitem">
    <button class="ctx-item" onclick={handleRename} type="button">
      <span class="ctx-item__label">Rename</span>
      <kbd class="ctx-item__shortcut">↵</kbd>
    </button>
  </li>

  {#if node.kind === "file"}
    <li role="menuitem">
      <button class="ctx-item" onclick={handleDuplicate} type="button">
        <span class="ctx-item__label">Duplicate</span>
        <kbd class="ctx-item__shortcut">⌘D</kbd>
      </button>
    </li>
  {/if}

  <li class="ctx-divider" role="separator"></li>

  <li role="menuitem">
    <button class="ctx-item ctx-item--danger" onclick={handleDelete} type="button">
      <span class="ctx-item__label">Delete</span>
      <kbd class="ctx-item__shortcut">⌘⌫</kbd>
    </button>
  </li>
</menu>

<style>
  .ctx-backdrop {
    position: fixed;
    inset: 0;
    z-index: 299;
  }

  .ctx-menu {
    position: fixed;
    z-index: 300;
    background: var(--surface-strong);
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
    padding: var(--space-1);
    min-width: 180px;
    list-style: none;
    animation: ctx-in 100ms ease;
  }

  .ctx-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 6px var(--space-3);
    background: transparent;
    border: none;
    border-radius: var(--radius-sm);
    cursor: pointer;
    font-family: var(--font-sans);
    font-size: var(--font-size-sm);
    color: var(--text);
    transition: background var(--transition);
    gap: var(--space-6);
  }

  .ctx-item:hover {
    background: var(--surface-hover);
  }

  .ctx-item--danger { color: var(--danger); }
  .ctx-item--danger:hover { background: var(--danger-soft); }

  .ctx-item__label { flex: 1; text-align: left; }

  .ctx-item__shortcut {
    font-family: var(--font-sans);
    font-size: var(--font-size-xs);
    color: var(--text-faint);
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 1px 5px;
    white-space: nowrap;
    pointer-events: none;
  }

  .ctx-divider {
    height: 1px;
    background: var(--border);
    margin: var(--space-1) 0;
  }

  @keyframes ctx-in {
    from { opacity: 0; transform: scale(0.95) translateY(-4px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
</style>
