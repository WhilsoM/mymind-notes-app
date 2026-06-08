<script lang="ts">
  interface Props {
    label: string;
    description?: string;
    children: import("svelte").Snippet;
  }

  let { label, description, children }: Props = $props();
</script>

<div class="settings-row">
  <div class="settings-row__label-group">
    <span class="settings-row__label">{label}</span>
    {#if description}
      <span class="settings-row__desc">{description}</span>
    {/if}
  </div>
  <div class="settings-row__control">
    {@render children()}
  </div>
</div>

<style>
  .settings-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-4);
    padding: var(--space-3) 0;
    border-bottom: 1px solid var(--border);
  }

  .settings-row:last-child {
    border-bottom: none;
  }

  .settings-row__label-group {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  .settings-row__label {
    font-size: var(--font-size-sm);
    font-weight: 500;
    color: var(--text);
  }

  .settings-row__desc {
    font-size: var(--font-size-xs);
    color: var(--text-faint);
    line-height: 1.4;
  }

  .settings-row__control {
    flex-shrink: 0;
  }
</style>
