<script lang="ts">
  interface Props {
    title: string;
    description?: string;
    action?: import("svelte").Snippet;
  }

  let { title, description, action }: Props = $props();
</script>

<div class="empty">
  <p class="empty__title">{title}</p>
  {#if description}
    <p class="empty__desc">{description}</p>
  {/if}
  {#if action}
    <div class="empty__action">
      {@render action()}
    </div>
  {/if}
</div>

<style>
  .empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-3);
    padding: var(--space-10) var(--space-6);
    text-align: center;
    height: 100%;
    min-height: 200px;
  }

  .empty__title {
    font-size: var(--font-size-md);
    font-weight: 500;
    color: var(--text-muted);
  }

  .empty__desc {
    font-size: var(--font-size-sm);
    color: var(--text-faint);
    max-width: 280px;
    line-height: 1.5;
  }

  .empty__action {
    margin-top: var(--space-2);
  }
</style>
