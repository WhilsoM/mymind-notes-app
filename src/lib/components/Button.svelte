<script lang="ts">
  interface Props {
    variant?: "primary" | "ghost" | "danger";
    size?: "sm" | "md";
    disabled?: boolean;
    autofocus?: boolean;
    type?: "button" | "submit" | "reset";
    onclick?: (e: MouseEvent) => void;
    children: import("svelte").Snippet;
  }

  let {
    variant = "ghost",
    size = "md",
    disabled = false,
    autofocus = false,
    type = "button",
    onclick,
    children,
  }: Props = $props();
</script>

<button
  {type}
  {disabled}
  {autofocus}
  class="btn btn--{variant} btn--{size}"
  {onclick}
>
  {@render children()}
</button>

<style>
  .btn {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    border: none;
    cursor: pointer;
    font-family: var(--font-sans);
    font-weight: 500;
    transition: background var(--transition), color var(--transition), opacity var(--transition);
    white-space: nowrap;
    border-radius: var(--radius-sm);
  }

  .btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  /* Sizes */
  .btn--md {
    height: 32px;
    padding: 0 var(--space-3);
    font-size: var(--font-size-sm);
  }

  .btn--sm {
    height: 26px;
    padding: 0 var(--space-2);
    font-size: var(--font-size-xs);
  }

  /* Variants */
  .btn--primary {
    background: var(--accent);
    color: #fff;
  }

  .btn--primary:hover:not(:disabled) {
    filter: brightness(1.08);
  }

  .btn--ghost {
    background: transparent;
    color: var(--text-muted);
  }

  .btn--ghost:hover:not(:disabled) {
    background: var(--surface-hover);
    color: var(--text);
  }

  .btn--danger {
    background: var(--danger-soft);
    color: var(--danger);
  }

  .btn--danger:hover:not(:disabled) {
    background: var(--danger);
    color: #fff;
  }
</style>
