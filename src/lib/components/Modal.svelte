<script lang="ts">
  interface Props {
    title: string;
    onclose: () => void;
    children: import("svelte").Snippet;
    footer?: import("svelte").Snippet;
  }

  let { title, onclose, children, footer }: Props = $props();

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Escape") onclose();
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- Backdrop -->
<div class="backdrop" onclick={onclose} role="presentation"></div>

<!-- Dialog -->
<div class="modal" role="dialog" aria-modal="true" aria-label={title}>
  <div class="modal__header">
    <span class="modal__title">{title}</span>
    <button class="modal__close" onclick={onclose} aria-label="Close">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </button>
  </div>
  <div class="modal__body">
    {@render children()}
  </div>
  {#if footer}
    <div class="modal__footer">
      {@render footer()}
    </div>
  {/if}
</div>

<style>
  .backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.72);
    z-index: 100;
    animation: fade-in 120ms ease;
  }

  .modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 101;
    background: var(--surface-strong);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
    min-width: 340px;
    max-width: 480px;
    width: 90vw;
    animation: slide-up 160ms ease;
  }

  .modal__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-4) var(--space-5);
    border-bottom: 1px solid var(--border);
  }

  .modal__title {
    font-size: var(--font-size-md);
    font-weight: 600;
    color: var(--text);
  }

  .modal__close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    background: transparent;
    border: none;
    border-radius: var(--radius-xs);
    cursor: pointer;
    color: var(--text-muted);
    transition: background var(--transition), color var(--transition);
  }

  .modal__close:hover {
    background: var(--surface-hover);
    color: var(--text);
  }

  .modal__body {
    padding: var(--space-5);
  }

  .modal__footer {
    display: flex;
    justify-content: flex-end;
    gap: var(--space-2);
    padding: var(--space-3) var(--space-5) var(--space-4);
    border-top: 1px solid var(--border);
  }

  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slide-up {
    from { opacity: 0; transform: translate(-50%, calc(-50% + 8px)); }
    to { opacity: 1; transform: translate(-50%, -50%); }
  }
</style>
