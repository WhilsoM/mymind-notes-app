<script lang="ts">
  interface Props {
    left: import("svelte").Snippet;
    right: import("svelte").Snippet;
  }

  let { left, right }: Props = $props();
</script>

<div class="split">
  <div class="split__left">
    {@render left()}
  </div>
  <div class="split__right">
    {@render right()}
  </div>
</div>

<style>
  .split {
    display: flex;
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }

  .split__left {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    flex-shrink: 0;
  }

  .split__right {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
    overflow: hidden;
    background: var(--bg);
  }
</style>
