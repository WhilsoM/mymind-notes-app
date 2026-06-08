export type Theme = "light" | "dark" | "system";

export interface AppSettings {
  theme: Theme;
  accentColor: string;
  compactMode: boolean;
  sidebarWidth: number;
  lastWorkspacePath: string | null;
  autosaveDelayMs: number;
}

export const DEFAULT_SETTINGS: AppSettings = {
  theme: "system",
  accentColor: "#8b6cff",
  compactMode: false,
  sidebarWidth: 280,
  lastWorkspacePath: null,
  autosaveDelayMs: 600,
};
