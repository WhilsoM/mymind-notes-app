use crate::domain::note::{Note, NoteMetadata};
use crate::fs::writer::{create_note_file, rename_note_file, trash_file, write_file};
use crate::state::AppState;
use std::path::PathBuf;
use tauri::State;

#[tauri::command]
pub async fn read_note(state: State<'_, AppState>, path: String) -> Result<Note, String> {
    let p = PathBuf::from(&path);
    state.validate_path(&p)?;

    tauri::async_runtime::spawn_blocking(move || {
        if !p.exists() {
            return Err(format!("Note not found: {path}"));
        }
        let content =
            std::fs::read_to_string(&p).map_err(|e| format!("Cannot read note: {e}"))?;
        let meta = NoteMetadata::from_path(&p)
            .ok_or_else(|| "Cannot read note metadata".to_string())?;
        Ok(Note {
            name: meta.name,
            path: meta.path,
            modified: meta.modified,
            content,
        })
    })
    .await
    .map_err(|e| format!("Task failed: {e}"))?
}

#[tauri::command]
pub async fn save_note(
    state: State<'_, AppState>,
    path: String,
    content: String,
) -> Result<(), String> {
    let p = PathBuf::from(&path);
    state.validate_path(&p)?;

    tauri::async_runtime::spawn_blocking(move || write_file(&p, &content))
        .await
        .map_err(|e| format!("Task failed: {e}"))?
}

#[tauri::command]
pub async fn create_note(
    state: State<'_, AppState>,
    dir_path: String,
    name: String,
) -> Result<NoteMetadata, String> {
    let dir = PathBuf::from(&dir_path);
    state.validate_parent(&dir)?;

    tauri::async_runtime::spawn_blocking(move || {
        if !dir.exists() || !dir.is_dir() {
            return Err(format!("Directory does not exist: {dir_path}"));
        }
        create_note_file(&dir, &name)
    })
    .await
    .map_err(|e| format!("Task failed: {e}"))?
}

#[tauri::command]
pub async fn delete_note(state: State<'_, AppState>, path: String) -> Result<(), String> {
    let p = PathBuf::from(&path);
    state.validate_path(&p)?;

    tauri::async_runtime::spawn_blocking(move || {
        if !p.exists() {
            return Err(format!("Note not found: {path}"));
        }
        trash_file(&p)
    })
    .await
    .map_err(|e| format!("Task failed: {e}"))?
}

#[tauri::command]
pub async fn rename_note(
    state: State<'_, AppState>,
    path: String,
    new_name: String,
) -> Result<NoteMetadata, String> {
    let p = PathBuf::from(&path);
    state.validate_path(&p)?;

    tauri::async_runtime::spawn_blocking(move || {
        if !p.exists() {
            return Err(format!("Note not found: {path}"));
        }
        rename_note_file(&p, &new_name)
    })
    .await
    .map_err(|e| format!("Task failed: {e}"))?
}
