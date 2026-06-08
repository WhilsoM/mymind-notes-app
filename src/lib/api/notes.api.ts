import { tauriInvoke } from "./tauri";
import type { FileNode } from "$lib/types/workspace";
import type { Note, NoteMetadata } from "$lib/types/note";
import type { AppSettings } from "$lib/types/settings";
import { open } from "@tauri-apps/plugin-dialog";

/**
 * High-level API — all backend calls go through these functions.
 * Components import from here, not from tauri.ts directly.
 */

export async function pickWorkspaceFolder(): Promise<string | null> {
  const selected = await open({
    directory: true,
    multiple: false,
    title: "Choose your notes folder",
  });
  return typeof selected === "string" ? selected : null;
}

export async function scanWorkspace(path: string): Promise<FileNode[]> {
  return tauriInvoke<FileNode[]>("scan_workspace", { path });
}

export async function readNote(path: string): Promise<Note> {
  return tauriInvoke<Note>("read_note", { path });
}

export async function saveNote(path: string, content: string): Promise<void> {
  return tauriInvoke<void>("save_note", { path, content });
}

export async function createNote(dirPath: string, name: string): Promise<NoteMetadata> {
  return tauriInvoke<NoteMetadata>("create_note", { dirPath, name });
}

export async function deleteNote(path: string): Promise<void> {
  return tauriInvoke<void>("delete_note", { path });
}

export async function renameNote(path: string, newName: string): Promise<NoteMetadata> {
  return tauriInvoke<NoteMetadata>("rename_note", { path, newName });
}

export async function createFolder(dirPath: string, name: string): Promise<FileNode> {
  return tauriInvoke<FileNode>("create_folder", { dirPath, name });
}

export async function loadSettings(): Promise<AppSettings> {
  return tauriInvoke<AppSettings>("load_settings");
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  return tauriInvoke<void>("save_settings", { settings });
}
