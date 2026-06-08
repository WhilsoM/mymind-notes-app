<script lang="ts">
  import { workspace } from "$lib/stores/workspace.store";
  import { notes } from "$lib/stores/notes.store";
  import NoteTreeItem from "./NoteTreeItem.svelte";
  import EmptyState from "./EmptyState.svelte";

  let activePath = $derived($notes.note?.path ?? null);
  let tree = $derived($workspace.tree);
  let isLoading = $derived($workspace.isLoading);
</script>

<div class="note-tree">
  {#if isLoading}
    <div class="note-tree__loading">
      <span>Loading…</span>
    </div>
  {:else if tree.length === 0}
    <EmptyState
      title="No notes found"
      description="This folder has no markdown files."
    />
  {:else}
    <div class="note-tree__list">
      {#each tree as node (node.path)}
        <NoteTreeItem {node} {activePath} />
      {/each}
    </div>
  {/if}
</div>

<style>
  .note-tree {
    flex: 1;
    overflow-y: auto;
    padding: var(--space-2) var(--space-2);
    min-height: 0;
  }

  .note-tree__loading {
    padding: var(--space-4);
    font-size: var(--font-size-sm);
    color: var(--text-faint);
    text-align: center;
  }

  .note-tree__list {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }
</style>
