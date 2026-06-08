export function basename(path: string): string {
  return path.split("/").pop() ?? path;
}

export function dirname(path: string): string {
  const parts = path.split("/");
  parts.pop();
  return parts.join("/") || "/";
}

export function stripExtension(name: string): string {
  const dot = name.lastIndexOf(".");
  return dot > 0 ? name.slice(0, dot) : name;
}

export function addMdExtension(name: string): string {
  return name.endsWith(".md") ? name : `${name}.md`;
}

export function isMdFile(name: string): boolean {
  return name.toLowerCase().endsWith(".md");
}
