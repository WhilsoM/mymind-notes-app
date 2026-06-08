use crate::domain::file_tree::{FileNode, FileNodeKind};
use crate::fs::scanner::scan_directory;
use crate::state::AppState;
use std::path::PathBuf;
use tauri::State;

#[tauri::command]
pub async fn scan_workspace(
    state: State<'_, AppState>,
    path: String,
) -> Result<Vec<FileNode>, String> {
    let root = PathBuf::from(&path);

    if !root.exists() {
        return Err(format!("Folder does not exist: {path}"));
    }
    if !root.is_dir() {
        return Err(format!("Path is not a folder: {path}"));
    }

    // Store the canonical root in app state
    let canonical = root
        .canonicalize()
        .map_err(|e| format!("Cannot resolve workspace path: {e}"))?;
    state.set_root(canonical.clone())?;

    let tree = tauri::async_runtime::spawn_blocking(move || scan_directory(&canonical))
        .await
        .map_err(|e| format!("Scan failed: {e}"))?;

    Ok(tree)
}

#[tauri::command]
pub async fn create_folder(
    state: State<'_, AppState>,
    dir_path: String,
    name: String,
) -> Result<FileNode, String> {
    let parent = PathBuf::from(&dir_path);
    state.validate_parent(&parent)?;

    tauri::async_runtime::spawn_blocking(move || {
        // Validate folder name
        if name.is_empty()
            || name.contains('/')
            || name.contains('\\')
            || name == ".."
            || name == "."
        {
            return Err("Invalid folder name".to_string());
        }

        let new_dir = parent.join(&name);
        if new_dir.exists() {
            return Err(format!("'{name}' already exists"));
        }

        std::fs::create_dir(&new_dir)
            .map_err(|e| format!("Cannot create folder: {e}"))?;

        Ok(FileNode {
            name,
            path: new_dir.to_string_lossy().into_owned(),
            kind: FileNodeKind::Dir,
            children: Some(vec![]),
        })
    })
    .await
    .map_err(|e| format!("Task failed: {e}"))?
}
