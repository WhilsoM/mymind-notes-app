<script lang="ts">
  import { settings } from "$lib/stores/settings.store";
  import { ui } from "$lib/stores/ui.store";
  import type { Theme } from "$lib/types/settings";
  import Modal from "./Modal.svelte";
  import SettingsRow from "./SettingsRow.svelte";

  const themes: { value: Theme; label: string }[] = [
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
    { value: "system", label: "System" },
  ];

  function handleAccentChange(e: Event) {
    settings.patch({ accentColor: (e.target as HTMLInputElement).value });
  }

  function handleThemeChange(value: Theme) {
    settings.patch({ theme: value });
  }

  function handleCompactToggle() {
    settings.patch({ compactMode: !$settings.compactMode });
  }
</script>

<Modal title="Settings" onclose={() => ui.closeSettings()}>
  <div class="settings">
    <!-- Appearance section -->
    <p class="settings__section-title">Appearance</p>

    <SettingsRow label="Theme">
      <div class="theme-picker">
        {#each themes as t}
          <button
            type="button"
            class="theme-btn"
            class:is-active={$settings.theme === t.value}
            onclick={() => handleThemeChange(t.value)}
          >{t.label}</button>
        {/each}
      </div>
    </SettingsRow>

    <SettingsRow label="Accent color" description="Used for active states and focus rings">
      <div class="accent-picker">
        <input
          type="color"
          value={$settings.accentColor}
          oninput={handleAccentChange}
          class="accent-picker__input"
          aria-label="Pick accent color"
        />
        <span class="accent-picker__value">{$settings.accentColor}</span>
      </div>
    </SettingsRow>

    <SettingsRow label="Compact mode" description="Reduce spacing and font sizes">
      <button
        type="button"
        role="switch"
        aria-checked={$settings.compactMode}
        aria-label="Toggle compact mode"
        class="toggle"
        class:is-on={$settings.compactMode}
        onclick={handleCompactToggle}
      >
        <span class="toggle__thumb"></span>
      </button>
    </SettingsRow>

    <!-- Info section -->
    <p class="settings__section-title settings__section-title--mt">About</p>
    <SettingsRow label="mymind notes" description="Version 0.1.0 — Tauri 2 + Svelte + Rust">
      <span class="settings__badge">MVP</span>
    </SettingsRow>
  </div>
</Modal>

<style>
  .settings {
    display: flex;
    flex-direction: column;
    min-width: 320px;
  }

  .settings__section-title {
    font-size: var(--font-size-xs);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--text-faint);
    margin-bottom: var(--space-2);
  }

  .settings__section-title--mt {
    margin-top: var(--space-5);
  }

  /* Theme picker */
  .theme-picker {
    display: flex;
    gap: 2px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 2px;
  }

  .theme-btn {
    padding: 3px var(--space-3);
    background: transparent;
    border: none;
    border-radius: calc(var(--radius-sm) - 2px);
    font-size: var(--font-size-xs);
    font-family: var(--font-sans);
    color: var(--text-muted);
    cursor: pointer;
    transition: background var(--transition), color var(--transition);
    font-weight: 500;
  }

  .theme-btn:hover { color: var(--text); }

  .theme-btn.is-active {
    background: var(--surface-strong);
    color: var(--text);
    box-shadow: var(--shadow-sm);
  }

  /* Accent picker */
  .accent-picker {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .accent-picker__input {
    width: 32px;
    height: 26px;
    padding: 2px;
    border: 1px solid var(--border);
    border-radius: var(--radius-xs);
    cursor: pointer;
    background: none;
  }

  .accent-picker__value {
    font-size: var(--font-size-xs);
    color: var(--text-muted);
    font-family: var(--font-mono);
  }

  /* Toggle switch */
  .toggle {
    width: 36px;
    height: 20px;
    background: var(--border-strong);
    border: none;
    border-radius: 999px;
    cursor: pointer;
    position: relative;
    transition: background var(--transition);
    padding: 0;
  }

  .toggle.is-on {
    background: var(--accent);
  }

  .toggle__thumb {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    background: white;
    border-radius: 50%;
    transition: transform var(--transition);
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  }

  .toggle.is-on .toggle__thumb {
    transform: translateX(16px);
  }

  .settings__badge {
    font-size: var(--font-size-xs);
    background: var(--accent-soft);
    color: var(--accent-text);
    padding: 2px var(--space-2);
    border-radius: var(--radius-xs);
    font-weight: 600;
  }
</style>
