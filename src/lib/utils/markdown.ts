/**
 * Minimal markdown → HTML renderer for preview mode.
 * Uses the browser's native capabilities + a small parser.
 * No heavy library needed for MVP preview.
 */
export function renderMarkdown(md: string): string {
  return md
    // Headings
    .replace(/^######\s(.+)$/gm, "<h6>$1</h6>")
    .replace(/^#####\s(.+)$/gm, "<h5>$1</h5>")
    .replace(/^####\s(.+)$/gm, "<h4>$1</h4>")
    .replace(/^###\s(.+)$/gm, "<h3>$1</h3>")
    .replace(/^##\s(.+)$/gm, "<h2>$1</h2>")
    .replace(/^#\s(.+)$/gm, "<h1>$1</h1>")
    // Bold + italic
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/_(.+?)_/g, "<em>$1</em>")
    // Inline code
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    // Blockquote
    .replace(/^>\s(.+)$/gm, "<blockquote>$1</blockquote>")
    // Horizontal rule
    .replace(/^---$/gm, "<hr>")
    // Unordered list items
    .replace(/^[-*]\s(.+)$/gm, "<li>$1</li>")
    // Ordered list items
    .replace(/^\d+\.\s(.+)$/gm, "<li>$1</li>")
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')
    // Line breaks → paragraphs (double newline)
    .replace(/\n\n/g, "</p><p>")
    .replace(/^(.+)$/, "<p>$1</p>");
}
