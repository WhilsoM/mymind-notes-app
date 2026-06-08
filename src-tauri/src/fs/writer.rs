use crate::domain::note::NoteMetadata;
use std::fs::OpenOptions;
use std::io::Write;
use std::path::Path;

/// Validate that a note name is safe:
/// - not empty
/// - no path separators (prevents traversal)
/// - no ".." component
pub fn validate_note_name(name: &str) -> Result<(), String> {
    let trimmed = name.trim();
    if trimmed.is_empty() || trimmed == ".md" {
        return Err("Note name cannot be empty".to_string());
    }
    if trimmed.contains('/') || trimmed.contains('\\') {
        return Err("Note name cannot contain path separators".to_string());
    }
    // Reject ".." and "." after stripping extension
    let stem = trimmed.strip_suffix(".md").unwrap_or(trimmed);
    if stem == ".." || stem == "." {
        return Err("Invalid note name".to_string());
    }
    Ok(())
}

/// Append .md extension if missing.
pub fn ensure_md_extension(name: &str) -> String {
    let trimmed = name.trim();
    if trimmed.to_lowercase().ends_with(".md") {
        trimmed.to_string()
    } else {
        format!("{trimmed}.md")
    }
}

/// Atomically write content to a file:
/// write to a temp file in the same directory, then rename over the target.
/// If the process crashes mid-write, the original file is untouched.
pub fn write_file(path: &Path, content: &str) -> Result<(), String> {
    let parent = path
        .parent()
        .ok_or_else(|| "Cannot determine file directory".to_string())?;

    std::fs::create_dir_all(parent).map_err(|e| format!("Cannot create directory: {e}"))?;

    let filename = path
        .file_name()
        .and_then(|n| n.to_str())
        .unwrap_or("note");
    let temp_path = parent.join(format!(".{filename}.tmp"));

    let mut file = std::fs::File::create(&temp_path)
        .map_err(|e| format!("Cannot create temp file: {e}"))?;
    file.write_all(content.as_bytes())
        .map_err(|e| format!("Cannot write content: {e}"))?;
    file.flush().map_err(|e| format!("Cannot flush file: {e}"))?;
    drop(file);

    std::fs::rename(&temp_path, path).map_err(|e| {
        let _ = std::fs::remove_file(&temp_path);
        format!("Cannot save file: {e}")
    })
}

/// Create a new .md file. Fails if file already exists (TOCTOU-safe).
pub fn create_note_file(dir: &Path, name: &str) -> Result<NoteMetadata, String> {
    validate_note_name(name)?;
    let filename = ensure_md_extension(name);
    let path = dir.join(&filename);

    // create_new(true) is atomic: fails if file already exists
    OpenOptions::new()
        .write(true)
        .create_new(true)
        .open(&path)
        .map_err(|e| {
            if e.kind() == std::io::ErrorKind::AlreadyExists {
                format!("A note named '{filename}' already exists.")
            } else {
                format!("Cannot create note: {e}")
            }
        })?;

    NoteMetadata::from_path(&path).ok_or_else(|| "Failed to read note metadata".to_string())
}

/// Move a file to system Trash.
pub fn trash_file(path: &Path) -> Result<(), String> {
    trash::delete(path).map_err(|e| format!("Cannot move to trash: {e}"))
}

/// Rename a .md file within the same directory.
pub fn rename_note_file(path: &Path, new_name: &str) -> Result<NoteMetadata, String> {
    validate_note_name(new_name)?;

    let parent = path
        .parent()
        .ok_or_else(|| "Cannot determine parent directory".to_string())?;

    let new_filename = ensure_md_extension(new_name);
    let new_path = parent.join(&new_filename);

    if new_path == path {
        return NoteMetadata::from_path(path)
            .ok_or_else(|| "Failed to read note metadata".to_string());
    }

    // create_new check: open with create_new to detect collision atomically
    if new_path.exists() {
        return Err(format!("A note named '{new_filename}' already exists."));
    }

    std::fs::rename(path, &new_path).map_err(|e| format!("Cannot rename note: {e}"))?;

    NoteMetadata::from_path(&new_path).ok_or_else(|| "Failed to read note metadata".to_string())
}
