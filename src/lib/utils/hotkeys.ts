type HotkeyHandler = (e: KeyboardEvent) => void;

interface HotkeyBinding {
  key: string;
  /** true = meta/ctrl required | false = meta/ctrl must NOT be pressed | undefined = don't care */
  meta?: boolean;
  shift?: boolean;
  allowInEditor?: boolean;
  handler: HotkeyHandler;
}

function isInEditor(target: EventTarget | null): boolean {
  if (!target) return false;
  const el = target as HTMLElement;
  return (
    el.tagName === "TEXTAREA" ||
    el.tagName === "INPUT" ||
    el.isContentEditable
  );
}

export function createHotkeyListener(bindings: HotkeyBinding[]): (e: KeyboardEvent) => void {
  return (e: KeyboardEvent) => {
    const metaPressed = e.metaKey || e.ctrlKey;

    for (const binding of bindings) {
      const keyMatch = e.key.toLowerCase() === binding.key.toLowerCase();
      if (!keyMatch) continue;

      // Check meta requirement
      if (binding.meta === true && !metaPressed) continue;
      if (binding.meta === false && metaPressed) continue;
      // binding.meta === undefined → don't check

      // Check shift requirement
      if (binding.shift === true && !e.shiftKey) continue;
      if (binding.shift === false && e.shiftKey) continue;

      if (!binding.allowInEditor && isInEditor(e.target)) continue;

      e.preventDefault();
      binding.handler(e);
      return;
    }
  };
}
