<script lang="ts">
  import { notes } from "$lib/stores/notes.store";
  import { renderMarkdown } from "$lib/utils/markdown";

  let content = $derived($notes.note?.content ?? "");
  let html = $derived(renderMarkdown(content));
</script>

<div class="preview">
  <div class="preview__content">
    {@html html}
  </div>
</div>

<style>
  .preview {
    flex: 1;
    overflow-y: auto;
    padding: var(--space-8);
  }

  .preview__content {
    max-width: 720px;
    margin: 0 auto;
    font-size: var(--font-size-md);
    line-height: 1.75;
    color: var(--text);
  }

  .preview__content :global(h1),
  .preview__content :global(h2),
  .preview__content :global(h3),
  .preview__content :global(h4) {
    font-weight: 600;
    margin: 1.4em 0 0.5em;
    color: var(--text);
    line-height: 1.3;
  }

  .preview__content :global(h1) { font-size: var(--font-size-xl); }
  .preview__content :global(h2) { font-size: var(--font-size-lg); }
  .preview__content :global(h3) { font-size: var(--font-size-md); }

  .preview__content :global(p) {
    margin: 0.75em 0;
  }

  .preview__content :global(code) {
    font-family: var(--font-mono);
    font-size: 0.88em;
    background: var(--surface-strong);
    border: 1px solid var(--border);
    padding: 0.1em 0.4em;
    border-radius: var(--radius-xs);
  }

  .preview__content :global(blockquote) {
    border-left: 3px solid var(--accent);
    padding-left: var(--space-4);
    margin: 1em 0;
    color: var(--text-muted);
  }

  .preview__content :global(hr) {
    border: none;
    border-top: 1px solid var(--border);
    margin: 1.5em 0;
  }

  .preview__content :global(a) {
    color: var(--accent-text);
    text-decoration: none;
  }

  .preview__content :global(a:hover) {
    text-decoration: underline;
  }

  .preview__content :global(li) {
    margin: 0.3em 0;
    padding-left: 1.2em;
    position: relative;
  }

  .preview__content :global(li::before) {
    content: "·";
    position: absolute;
    left: 0;
    color: var(--accent);
    font-weight: 700;
  }
</style>
