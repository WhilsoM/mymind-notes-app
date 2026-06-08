import { writable, get } from "svelte/store";
import type { NoteState } from "$lib/types/note";
import { readNote, saveNote, createNote, deleteNote, renameNote } from "$lib/api/notes.api";
import type { NoteMetadata } from "$lib/types/note";
import { debounce } from "$lib/utils/debounce";
import { workspace } from "./workspace.store";
import { settings } from "./settings.store";

const initial: NoteState = {
  note: null,
  isDirty: false,
  isSaving: false,
};

function createNotesStore() {
  const { subscribe, set, update } = writable<NoteState>(initial);

  let autosaveFn = debounce(async (path: string, content: string) => {
    update((s) => ({ ...s, isSaving: true }));
    try {
      await saveNote(path, content);
      update((s) => ({ ...s, isDirty: false, isSaving: false }));
    } catch {
      update((s) => ({ ...s, isSaving: false }));
    }
  }, 600);

  settings.subscribe((s) => {
    autosaveFn = debounce(async (path: string, content: string) => {
      update((ns) => ({ ...ns, isSaving: true }));
      try {
        await saveNote(path, content);
        update((ns) => ({ ...ns, isDirty: false, isSaving: false }));
      } catch {
        update((ns) => ({ ...ns, isSaving: false }));
      }
    }, s.autosaveDelayMs);
  });

  return {
    subscribe,
    async open(path: string) {
      const current = get({ subscribe });
      if (current.isDirty && current.note) {
        await saveNote(current.note.path, current.note.content).catch(console.error);
      }
      update((s) => ({ ...s, isSaving: false }));
      try {
        const note = await readNote(path);
        set({ note, isDirty: false, isSaving: false });
      } catch (err) {
        throw err;
      }
    },
    edit(content: string) {
      update((s) => {
        if (!s.note) return s;
        const next = { ...s, note: { ...s.note, content }, isDirty: true };
        autosaveFn(s.note.path, content);
        return next;
      });
    },
    async save() {
      const state = get({ subscribe });
      if (!state.note || !state.isDirty) return;
      update((s) => ({ ...s, isSaving: true }));
      await saveNote(state.note.path, state.note.content);
      update((s) => ({ ...s, isDirty: false, isSaving: false }));
    },
    close() {
      set(initial);
    },
    async create(dirPath: string, name: string) {
      const meta = await createNote(dirPath, name);
      await workspace.refresh();
      return meta;
    },
    async remove(path: string) {
      const state = get({ subscribe });
      await deleteNote(path);
      if (state.note?.path === path) set(initial);
      await workspace.refresh();
    },
    async rename(path: string, newName: string) {
      const state = get({ subscribe });
      const meta = await renameNote(path, newName);
      if (state.note?.path === path) {
        update((s) => ({
          ...s,
          note: s.note ? { ...s.note, path: meta.path, name: meta.name } : null,
        }));
      }
      await workspace.refresh();
      return meta;
    },
    async duplicate(sourcePath: string, dirPath: string, newName: string): Promise<NoteMetadata> {
      const note = await readNote(sourcePath);
      const meta = await createNote(dirPath, newName);
      await saveNote(meta.path, note.content);
      await workspace.refresh();
      return meta;
    },
  };
}

export const notes = createNotesStore();
