import { writable } from "svelte/store";
import type { AppSettings } from "$lib/types/settings";
import { DEFAULT_SETTINGS } from "$lib/types/settings";
import { loadSettings, saveSettings } from "$lib/api/notes.api";

function createSettingsStore() {
  const { subscribe, set, update } = writable<AppSettings>({ ...DEFAULT_SETTINGS });

  function applyTheme(settings: AppSettings) {
    const root = document.documentElement;

    if (settings.theme === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.setAttribute("data-theme", prefersDark ? "dark" : "light");
    } else {
      root.setAttribute("data-theme", settings.theme);
    }

    root.style.setProperty("--accent", settings.accentColor);
    root.style.setProperty("--sidebar-width", `${settings.sidebarWidth}px`);

    if (settings.compactMode) {
      root.setAttribute("data-compact", "true");
    } else {
      root.removeAttribute("data-compact");
    }
  }

  return {
    subscribe,
    async init() {
      try {
        const saved = await loadSettings();
        set(saved);
        applyTheme(saved);
      } catch {
        applyTheme(DEFAULT_SETTINGS);
      }
    },
    async patch(partial: Partial<AppSettings>) {
      update((s) => {
        const next = { ...s, ...partial };
        applyTheme(next);
        saveSettings(next).catch(console.error);
        return next;
      });
    },
  };
}

export const settings = createSettingsStore();
