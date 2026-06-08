use std::path::{Path, PathBuf};
use std::sync::Mutex;

/// Global app state — holds the canonical workspace root.
/// Every file operation must validate paths against this root.
pub struct AppState {
    pub workspace_root: Mutex<Option<PathBuf>>,
}

impl AppState {
    pub fn new() -> Self {
        AppState {
            workspace_root: Mutex::new(None),
        }
    }

    pub fn set_root(&self, path: PathBuf) -> Result<(), String> {
        let mut guard = self
            .workspace_root
            .lock()
            .map_err(|_| "State lock poisoned".to_string())?;
        *guard = Some(path);
        Ok(())
    }

    /// Validate that `path` (which must already exist) is inside the workspace root.
    /// Uses canonicalize() to resolve symlinks and ".." components.
    pub fn validate_path(&self, path: &Path) -> Result<(), String> {
        let guard = self
            .workspace_root
            .lock()
            .map_err(|_| "State lock poisoned".to_string())?;
        let root = guard
            .as_ref()
            .ok_or_else(|| "No workspace is open".to_string())?;

        let canonical = path
            .canonicalize()
            .map_err(|_| "Cannot access path".to_string())?;
        let canonical_root = root
            .canonicalize()
            .map_err(|_| "Cannot access workspace".to_string())?;

        if !canonical.starts_with(&canonical_root) {
            return Err("Access denied: path is outside workspace".to_string());
        }
        Ok(())
    }

    /// Validate a parent directory for a file that does not yet exist.
    pub fn validate_parent(&self, dir: &Path) -> Result<(), String> {
        self.validate_path(dir)
    }
}
