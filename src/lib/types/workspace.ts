export type FileNodeKind = "file" | "dir";

export interface FileNode {
  name: string;
  path: string;
  kind: FileNodeKind;
  children?: FileNode[];
}

export interface WorkspaceState {
  path: string | null;
  tree: FileNode[];
  isLoading: boolean;
  error: string | null;
}
