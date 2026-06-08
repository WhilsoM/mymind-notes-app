<script lang="ts">
  interface Props {
    label: string;
    active?: boolean;
    danger?: boolean;
    size?: "sm" | "md";
    onclick?: (e: MouseEvent) => void;
    children: import("svelte").Snippet;
  }

  let { label, active = false, danger = false, size = "md", onclick, children }: Props = $props();
</script>

<button
  type="button"
  aria-label={label}
  title={label}
  class="icon-btn icon-btn--{size}"
  class:is-active={active}
  class:is-danger={danger}
  {onclick}
>
  {@render children()}
</button>

<style>
  .icon-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: transparent;
    color: var(--text-muted);
    cursor: pointer;
    border-radius: var(--radius-sm);
    transition: background var(--transition), color var(--transition);
    flex-shrink: 0;
  }

  .icon-btn--md {
    width: 30px;
    height: 30px;
  }

  .icon-btn--sm {
    width: 24px;
    height: 24px;
  }

  .icon-btn:hover {
    background: var(--surface-hover);
    color: var(--text);
  }

  .icon-btn.is-active {
    background: var(--accent-soft);
    color: var(--accent-text);
  }

  .icon-btn.is-danger:hover {
    background: var(--danger-soft);
    color: var(--danger);
  }
</style>
