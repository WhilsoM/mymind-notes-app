<script lang="ts">
  import { onMount } from "svelte";
  import { settings } from "$lib/stores/settings.store";
  import { workspace } from "$lib/stores/workspace.store";
  import { notes } from "$lib/stores/notes.store";
  import { ui } from "$lib/stores/ui.store";
  import { createHotkeyListener } from "$lib/utils/hotkeys";

  import TopBar from "$lib/components/TopBar.svelte";
  import Sidebar from "$lib/components/Sidebar.svelte";
  import NoteEditor from "$lib/components/NoteEditor.svelte";
  import NotePreview from "$lib/components/NotePreview.svelte";
  import SplitPane from "$lib/components/SplitPane.svelte";
  import SettingsPanel from "$lib/components/SettingsPanel.svelte";
  import WelcomeScreen from "$lib/components/WelcomeScreen.svelte";
  import Toast from "$lib/components/Toast.svelte";
  import Modal from "$lib/components/Modal.svelte";
  import Button from "$lib/components/Button.svelte";

  let settingsOpen = $derived($ui.settingsOpen);
  let confirmDelete = $derived($ui.confirmDelete);
  let previewMode = $derived($ui.previewMode);
  let hasWorkspace = $derived($workspace.path !== null);

  function deleteSelected() {
    const target = $ui.selectedPath ?? $notes.note?.path;
    if (!target) return;
    const name = (target.split("/").pop() ?? "").replace(/\.md$/, "");
    ui.confirmDeleteNote(target, name);
  }

  function renameSelected() {
    const target = $ui.selectedPath ?? $notes.note?.path;
    if (target) ui.startRename(target);
  }

  function createNewNote() {
    const path = $workspace.path;
    if (!path) return;
    const dir = $ui.selectedPath
      ? ($ui.selectedPath.includes("/") ? $ui.selectedPath.split("/").slice(0, -1).join("/") : path)
      : path;
    notes.create(dir, "Untitled")
      .then((meta) => {
        ui.selectPath(meta.path);
        notes.open(meta.path);
        ui.startRename(meta.path);
      })
      .catch((e: Error) => ui.toast(e.message, "error"));
  }

  // Global hotkeys
  const hotkeyListener = createHotkeyListener([
    { key: "t", meta: true, handler: createNewNote },
    { key: "o", meta: true, handler: () => workspace.open().catch((e: Error) => ui.toast(e.message, "error")) },
    { key: "w", meta: true, handler: () => notes.close() },
    { key: "s", meta: true, handler: () => notes.save().catch((e: Error) => ui.toast(e.message, "error")) },
    // macOS "delete" key = Backspace; also handle Delete for external keyboards
    { key: "Backspace", meta: true, handler: deleteSelected },
    { key: "Delete",    meta: true, handler: deleteSelected },
    // Enter rename — only when meta is NOT held
    { key: "Enter", meta: false, handler: renameSelected },
    { key: ",", meta: true, handler: () => ui.openSettings() },
    {
      key: "Escape",
      handler: () => {
        if ($ui.contextMenu)  { ui.hideContextMenu(); return; }
        if ($ui.settingsOpen) { ui.closeSettings();   return; }
        if ($ui.renamingPath) { ui.stopRename();       return; }
        if ($ui.confirmDelete){ ui.cancelDelete();     return; }
      },
    },
  ]);

  async function confirmDeleteAction() {
    if (!confirmDelete) return;
    await notes.remove(confirmDelete.path).catch((e: Error) => ui.toast(e.message, "error"));
    ui.cancelDelete();
    ui.selectPath(null);
    ui.toast("Note moved to trash", "success");
  }

  onMount(() => {
    settings.init().then(() => {
      const lastPath = $settings.lastWorkspacePath;
      if (lastPath) workspace.reopen(lastPath).catch(() => {});
    });

    window.addEventListener("keydown", hotkeyListener);
    return () => window.removeEventListener("keydown", hotkeyListener);
  });
</script>

<div class="app">
  {#if !hasWorkspace}
    <!-- Full centered welcome when no folder is open -->
    <WelcomeScreen />
  {:else}
    <TopBar />
    <SplitPane>
      {#snippet left()}
        <Sidebar />
      {/snippet}
      {#snippet right()}
        {#if previewMode && $notes.note}
          <NotePreview />
        {:else}
          <NoteEditor />
        {/if}
      {/snippet}
    </SplitPane>
  {/if}
</div>

<!-- Overlays -->
{#if settingsOpen}
  <SettingsPanel />
{/if}

{#if confirmDelete}
  <Modal title="Delete note" onclose={() => ui.cancelDelete()}>
    <p class="confirm-msg">
      Delete <strong>{confirmDelete.name}</strong>? This will move it to Trash.
    </p>
    {#snippet footer()}
      <!-- autofocus on Cancel so keyboard-only users don't accidentally delete -->
      <Button variant="ghost" onclick={() => ui.cancelDelete()} autofocus>Cancel</Button>
      <Button variant="danger" onclick={confirmDeleteAction}>Delete</Button>
    {/snippet}
  </Modal>
{/if}

<Toast />

<style>
  .app {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
  }

  .confirm-msg {
    font-size: var(--font-size-sm);
    color: var(--text-muted);
    line-height: 1.5;
  }

  .confirm-msg strong {
    color: var(--text);
    font-weight: 600;
  }
</style>
