<script lang="ts">
  import { workspace } from "$lib/stores/workspace.store";
  import { notes } from "$lib/stores/notes.store";
  import { ui } from "$lib/stores/ui.store";
  import NoteTree from "./NoteTree.svelte";
  import IconButton from "./IconButton.svelte";
  import ContextMenu from "./ContextMenu.svelte";

  let workspacePath = $derived($workspace.path);
  let workspaceName = $derived(workspacePath ? workspacePath.split("/").pop() : null);
  let sidebarVisible = $derived($ui.sidebarVisible);
  let contextMenu = $derived($ui.contextMenu);

  // Inline folder-creation state
  let folderInputVisible = $state(false);
  let folderInputValue = $state("");

  function getCreationDir(): string {
    const root = workspacePath!;
    const selected = $ui.selectedPath;
    if (!selected) return root;
    const tree = $workspace.tree;
    function findNode(nodes: typeof tree): import("$lib/types/workspace").FileNode | null {
      for (const n of nodes) {
        if (n.path === selected) return n;
        if (n.children) { const f = findNode(n.children); if (f) return f; }
      }
      return null;
    }
    const node = findNode(tree);
    if (node?.kind === "dir") return node.path;
    if (selected.includes("/")) return selected.split("/").slice(0, -1).join("/");
    return root;
  }

  function handleNewNote() {
    if (!workspacePath) return;
    const dir = getCreationDir();
    notes.create(dir, "Untitled")
      .then((meta) => {
        ui.selectPath(meta.path);
        notes.open(meta.path).then(() => {
          // focus happens automatically via NoteEditor $effect
        });
        ui.startRename(meta.path);
      })
      .catch((e: Error) => ui.toast(e.message, "error"));
  }

  function handleNewFolderBtn() {
    if (!workspacePath) return;
    folderInputVisible = true;
    folderInputValue = "";
  }

  function commitFolderCreation() {
    const name = folderInputValue.trim();
    folderInputVisible = false;
    folderInputValue = "";
    if (!name || !workspacePath) return;
    const dir = getCreationDir();
    workspace.createFolder(dir, name)
      .then(() => ui.toast(`Folder "${name}" created`, "success"))
      .catch((e: Error) => ui.toast(e.message, "error"));
  }

  function cancelFolderCreation() {
    folderInputVisible = false;
    folderInputValue = "";
  }

  function handleFolderInputKeydown(e: KeyboardEvent) {
    if (e.key === "Enter") { e.preventDefault(); commitFolderCreation(); }
    if (e.key === "Escape") cancelFolderCreation();
  }

  function handleOpenFolder() {
    workspace.open().catch((e: Error) => ui.toast(e.message, "error"));
  }
</script>

{#if !sidebarVisible}
  <div
    class="sidebar-trigger"
    onmouseenter={() => ui.showSidebar()}
    role="presentation"
  ></div>
{/if}

<aside
  class="sidebar"
  class:is-visible={sidebarVisible}
  onmouseleave={() => { if (!sidebarVisible) ui.hideSidebar(); }}
>
  <!-- Header -->
  <div class="sidebar__header">
    <div class="sidebar__workspace">
      {#if workspaceName}
        <span class="sidebar__workspace-name" title={workspacePath ?? ""}>{workspaceName}</span>
      {:else}
        <span class="sidebar__workspace-name sidebar__workspace-name--empty">No folder open</span>
      {/if}
    </div>
    <div class="sidebar__actions">
      {#if workspacePath}
        <IconButton label="New note (⌘T)" onclick={handleNewNote}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1v12M1 7h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </IconButton>
        <IconButton label="New folder" onclick={handleNewFolderBtn}>
          <svg width="15" height="13" viewBox="0 0 16 14" fill="none">
            <path d="M1 2.5A1.5 1.5 0 012.5 1h3.17a1.5 1.5 0 011.06.44l.83.83A1.5 1.5 0 008.62 3H13.5A1.5 1.5 0 0115 4.5v7A1.5 1.5 0 0113.5 13h-11A1.5 1.5 0 011 11.5v-9z" stroke="currentColor" stroke-width="1.2" fill="none"/>
            <path d="M8 6v4M6 8h4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
          </svg>
        </IconButton>
      {/if}
      <IconButton label="Open / switch folder (⌘O)" onclick={handleOpenFolder}>
        <svg width="15" height="13" viewBox="0 0 15 13" fill="none">
          <path d="M1 2.5A1.5 1.5 0 012.5 1h3.17a1.5 1.5 0 011.06.44l.83.83A1.5 1.5 0 008.62 3H12.5A1.5 1.5 0 0114 4.5v6A1.5 1.5 0 0112.5 12h-10A1.5 1.5 0 011 10.5v-8z" stroke="currentColor" stroke-width="1.2" fill="none"/>
        </svg>
      </IconButton>
    </div>
  </div>

  <!-- Inline new-folder input -->
  {#if folderInputVisible}
    <div class="new-folder-row">
      <span class="new-folder-row__icon">
        <svg width="14" height="12" viewBox="0 0 14 12" fill="none">
          <path d="M1 2.5A1.5 1.5 0 012.5 1h3.17a1.5 1.5 0 011.06.44l.83.83A1.5 1.5 0 008.62 3H11.5A1.5 1.5 0 0113 4.5v5A1.5 1.5 0 0111.5 11h-9A1.5 1.5 0 011 9.5v-7z" stroke="currentColor" stroke-width="1.2" fill="none"/>
        </svg>
      </span>
      <input
        class="new-folder-row__input"
        bind:value={folderInputValue}
        placeholder="Folder name"
        onkeydown={handleFolderInputKeydown}
        onblur={commitFolderCreation}
        autofocus
      />
    </div>
  {/if}

  <!-- File tree -->
  <NoteTree />
</aside>

<!-- Context menu portal -->
{#if contextMenu}
  <ContextMenu x={contextMenu.x} y={contextMenu.y} node={contextMenu.node} />
{/if}

<style>
  .sidebar-trigger {
    position: fixed;
    left: 0; top: 0; bottom: 0;
    width: 12px;
    z-index: 10;
  }

  .sidebar {
    width: var(--sidebar-width);
    min-width: var(--sidebar-width);
    max-width: var(--sidebar-width);
    height: 100%;
    background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    flex-shrink: 0;
    transition: width var(--transition-slow), min-width var(--transition-slow), opacity var(--transition-slow);
  }

  .sidebar:not(.is-visible) {
    width: 0; min-width: 0; opacity: 0; pointer-events: none;
  }

  .sidebar__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-3) var(--space-3) var(--space-2);
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
    padding-top: calc(var(--space-3) + 4px);
    padding-left: var(--space-4);
    min-height: var(--topbar-height);
  }

  .sidebar__workspace { min-width: 0; flex: 1; }

  .sidebar__workspace-name {
    font-size: var(--font-size-sm);
    font-weight: 600;
    color: var(--text);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
  }

  .sidebar__workspace-name--empty { color: var(--text-faint); font-weight: 400; }

  .sidebar__actions {
    display: flex;
    align-items: center;
    gap: 2px;
    flex-shrink: 0;
  }

  /* ── Inline folder creation row ── */
  .new-folder-row {
    display: flex;
    align-items: center;
    gap: var(--space-1);
    padding: var(--space-1) var(--space-3) var(--space-1) calc(12px + var(--space-1));
    border-bottom: 1px solid var(--border);
  }

  .new-folder-row__icon {
    display: flex;
    align-items: center;
    width: 16px;
    flex-shrink: 0;
    color: var(--accent);
    opacity: 0.7;
  }

  .new-folder-row__input {
    flex: 1;
    height: 26px;
    background: var(--surface-strong);
    border: 1.5px solid var(--accent);
    border-radius: var(--radius-xs);
    font-size: var(--font-size-sm);
    font-family: var(--font-sans);
    color: var(--text);
    padding: 0 var(--space-2);
    outline: none;
    user-select: text;
  }

  .new-folder-row__input::placeholder { color: var(--text-faint); }
</style>
