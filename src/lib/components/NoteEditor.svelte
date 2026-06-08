<script lang="ts">
  import { notes } from "$lib/stores/notes.store";
  import { workspace } from "$lib/stores/workspace.store";
  import Button from "./Button.svelte";

  let note = $derived($notes.note);
  let hasWorkspace = $derived(!!$workspace.path);
  let content = $derived($notes.note?.content ?? "");
  let textareaEl: HTMLTextAreaElement | undefined = $state();

  // Auto-focus the editor whenever a note is opened
  $effect(() => {
    if (note && textareaEl) {
      requestAnimationFrame(() => textareaEl?.focus());
    }
  });

  function handleInput(e: Event) {
    notes.edit((e.target as HTMLTextAreaElement).value);
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = e.target as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = content.slice(0, start) + "  " + content.slice(end);
      notes.edit(newValue);
      requestAnimationFrame(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      });
    }
  }
</script>

<div class="editor-wrap">
  {#if note}
    <textarea
      class="editor"
      bind:this={textareaEl}
      value={content}
      oninput={handleInput}
      onkeydown={handleKeydown}
      spellcheck={true}
      autocomplete="off"
      aria-label="Note editor"
    ></textarea>
  {:else if hasWorkspace}
    <div class="no-note">
      <p class="no-note__title">No note open</p>
      <p class="no-note__desc">
        Select a note from the sidebar or press <kbd>⌘T</kbd> to create one.
      </p>
    </div>
  {:else}
    <div class="no-note">
      <p class="no-note__title">No folder open</p>
      <p class="no-note__desc">Choose a folder to start working with your notes.</p>
      <div class="no-note__action">
        <Button variant="primary" onclick={() => workspace.open()}>Open folder</Button>
      </div>
    </div>
  {/if}
</div>

<style>
  .editor-wrap {
    flex: 1;
    display: flex;
    min-height: 0;
    overflow: hidden;
  }

  .editor {
    flex: 1;
    width: 100%;
    resize: none;
    border: none;
    outline: none;
    padding: var(--space-8) var(--space-8);
    background: transparent;
    font-family: var(--font-mono);
    font-size: var(--font-size-base);
    line-height: 1.7;
    color: var(--text);
    caret-color: var(--accent);
    overflow-y: auto;
    tab-size: 2;
    max-width: 720px;
    margin: 0 auto;
  }

  .editor::placeholder { color: var(--text-faint); }

  :global([data-compact]) .editor {
    padding: var(--space-5) var(--space-6);
    font-size: var(--font-size-sm);
  }

  /* ── Empty state ── */
  .no-note {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: var(--space-2);
    padding: var(--space-8) var(--space-6);
    min-height: 0;
    width: 100%;
  }

  .no-note__title {
    font-size: var(--font-size-md);
    font-weight: 500;
    color: var(--text-muted);
    margin: 0;
  }

  .no-note__desc {
    font-size: var(--font-size-sm);
    color: var(--text-faint);
    max-width: 300px;
    line-height: 1.55;
    margin: 0;
  }

  .no-note__desc kbd {
    font-family: var(--font-sans);
    font-size: var(--font-size-xs);
    background: var(--surface-strong);
    border: 1px solid var(--border-strong);
    border-radius: 4px;
    padding: 1px 5px;
  }

  .no-note__action { margin-top: var(--space-3); }
</style>
