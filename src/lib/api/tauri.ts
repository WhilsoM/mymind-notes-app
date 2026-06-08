import { invoke } from "@tauri-apps/api/core";

/**
 * Low-level wrappers around Tauri invoke.
 * All Tauri commands go through here — never call invoke() directly in components.
 */
export async function tauriInvoke<T>(command: string, args?: Record<string, unknown>): Promise<T> {
  return invoke<T>(command, args);
}
