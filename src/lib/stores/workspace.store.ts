import { writable } from "svelte/store";
import type { WorkspaceState } from "$lib/types/workspace";
import { pickWorkspaceFolder, scanWorkspace, createFolder } from "$lib/api/notes.api";
import { settings } from "./settings.store";

const initial: WorkspaceState = {
  path: null,
  tree: [],
  isLoading: false,
  error: null,
};

function createWorkspaceStore() {
  const { subscribe, set, update } = writable<WorkspaceState>(initial);

  return {
    subscribe,
    async open() {
      const path = await pickWorkspaceFolder();
      if (!path) return;

      update((s) => ({ ...s, isLoading: true, error: null }));
      try {
        const tree = await scanWorkspace(path);
        set({ path, tree, isLoading: false, error: null });
        settings.patch({ lastWorkspacePath: path });
      } catch (err) {
        update((s) => ({
          ...s,
          isLoading: false,
          error: err instanceof Error ? err.message : "Failed to open folder",
        }));
      }
    },
    async reopen(path: string) {
      update((s) => ({ ...s, isLoading: true, error: null }));
      try {
        const tree = await scanWorkspace(path);
        set({ path, tree, isLoading: false, error: null });
      } catch (err) {
        update((s) => ({
          ...s,
          isLoading: false,
          error: err instanceof Error ? err.message : "Failed to reload folder",
        }));
      }
    },
    async refresh() {
      let currentPath: string | null = null;
      subscribe((s) => { currentPath = s.path; })();
      if (currentPath) await this.reopen(currentPath);
    },
    async createFolder(dirPath: string, name: string) {
      await createFolder(dirPath, name);
      await this.refresh();
    },
  };
}

export const workspace = createWorkspaceStore();
