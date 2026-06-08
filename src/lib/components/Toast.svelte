<script lang="ts">
  import { ui, type Toast } from "$lib/stores/ui.store";

  function iconFor(type: Toast["type"]) {
    if (type === "success") return "✓";
    if (type === "error") return "✕";
    return "·";
  }
</script>

<div class="toast-stack" aria-live="polite">
  {#each $ui.toasts as toast (toast.id)}
    <div class="toast toast--{toast.type}" role="status">
      <span class="toast__icon">{iconFor(toast.type)}</span>
      <span class="toast__message">{toast.message}</span>
      <button
        class="toast__dismiss"
        aria-label="Dismiss"
        onclick={() => ui.dismissToast(toast.id)}
      >×</button>
    </div>
  {/each}
</div>

<style>
  .toast-stack {
    position: fixed;
    bottom: var(--space-6);
    left: 50%;
    transform: translateX(-50%);
    z-index: 200;
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    pointer-events: none;
  }

  .toast {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-4);
    border-radius: var(--radius-md);
    border: 1px solid var(--border);
    background: var(--surface-strong);
    box-shadow: var(--shadow-md);
    font-size: var(--font-size-sm);
    color: var(--text);
    pointer-events: all;
    animation: toast-in 160ms ease;
    min-width: 220px;
    max-width: 400px;
  }

  .toast--success .toast__icon { color: var(--success); }
  .toast--error .toast__icon { color: var(--danger); }
  .toast--info .toast__icon { color: var(--accent); }

  .toast__icon {
    font-size: var(--font-size-md);
    font-weight: 700;
    flex-shrink: 0;
  }

  .toast__message {
    flex: 1;
  }

  .toast__dismiss {
    background: transparent;
    border: none;
    cursor: pointer;
    color: var(--text-muted);
    font-size: var(--font-size-md);
    line-height: 1;
    padding: 0 0 0 var(--space-2);
    transition: color var(--transition);
  }

  .toast__dismiss:hover { color: var(--text); }

  @keyframes toast-in {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>
