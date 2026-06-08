import { writable } from "svelte/store";
import type { FileNode } from "$lib/types/workspace";

export interface Toast {
  id: string;
  message: string;
  type: "info" | "success" | "error";
  duration?: number;
}

export interface ContextMenuState {
  x: number;
  y: number;
  node: FileNode;
}

interface UIState {
  sidebarVisible: boolean;
  settingsOpen: boolean;
  previewMode: boolean;
  renamingPath: string | null;
  toasts: Toast[];
  confirmDelete: { path: string; name: string } | null;
  selectedPath: string | null;
  collapsedPaths: Set<string>;
  contextMenu: ContextMenuState | null;
}

const initial: UIState = {
  sidebarVisible: true,
  settingsOpen: false,
  previewMode: false,
  renamingPath: null,
  toasts: [],
  confirmDelete: null,
  selectedPath: null,
  collapsedPaths: new Set(),
  contextMenu: null,
};

function createUIStore() {
  const { subscribe, update } = writable<UIState>(initial);

  return {
    subscribe,
    toggleSidebar() {
      update((s) => ({ ...s, sidebarVisible: !s.sidebarVisible }));
    },
    showSidebar() {
      update((s) => ({ ...s, sidebarVisible: true }));
    },
    hideSidebar() {
      update((s) => ({ ...s, sidebarVisible: false }));
    },
    openSettings() {
      update((s) => ({ ...s, settingsOpen: true }));
    },
    closeSettings() {
      update((s) => ({ ...s, settingsOpen: false }));
    },
    togglePreview() {
      update((s) => ({ ...s, previewMode: !s.previewMode }));
    },
    selectPath(path: string | null) {
      update((s) => ({ ...s, selectedPath: path }));
    },
    collapseDir(path: string) {
      update((s) => {
        const set = new Set(s.collapsedPaths);
        set.add(path);
        return { ...s, collapsedPaths: set };
      });
    },
    expandDir(path: string) {
      update((s) => {
        const set = new Set(s.collapsedPaths);
        set.delete(path);
        return { ...s, collapsedPaths: set };
      });
    },
    startRename(path: string) {
      update((s) => ({ ...s, renamingPath: path }));
    },
    stopRename() {
      update((s) => ({ ...s, renamingPath: null }));
    },
    confirmDeleteNote(path: string, name: string) {
      update((s) => ({ ...s, confirmDelete: { path, name } }));
    },
    cancelDelete() {
      update((s) => ({ ...s, confirmDelete: null }));
    },
    toast(message: string, type: Toast["type"] = "info", duration = 3000) {
      const id = crypto.randomUUID();
      update((s) => ({
        ...s,
        toasts: [...s.toasts, { id, message, type, duration }],
      }));
      setTimeout(() => {
        update((s) => ({ ...s, toasts: s.toasts.filter((t) => t.id !== id) }));
      }, duration);
    },
    dismissToast(id: string) {
      update((s) => ({ ...s, toasts: s.toasts.filter((t) => t.id !== id) }));
    },
    showContextMenu(x: number, y: number, node: import("$lib/types/workspace").FileNode) {
      update((s) => ({ ...s, contextMenu: { x, y, node } }));
    },
    hideContextMenu() {
      update((s) => ({ ...s, contextMenu: null }));
    },
  };
}

export const ui = createUIStore();
