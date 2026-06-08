export interface NoteMetadata {
  name: string;       // filename without .md
  path: string;       // absolute path on disk
  modified: number;   // unix timestamp ms
}

export interface Note extends NoteMetadata {
  content: string;
}

export interface NoteState {
  note: Note | null;
  isDirty: boolean;
  isSaving: boolean;
}
