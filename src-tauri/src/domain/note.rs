use serde::{Deserialize, Serialize};
use std::path::Path;

/// Metadata about a note — returned on scan, create, rename.
/// Does NOT include content (content is only loaded on open).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NoteMetadata {
    pub name: String,
    pub path: String,
    pub modified: u64,
}

/// Full note with content — returned only on read_note.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Note {
    pub name: String,
    pub path: String,
    pub modified: u64,
    pub content: String,
}

impl NoteMetadata {
    pub fn from_path(path: &Path) -> Option<Self> {
        let name = path.file_name()?.to_string_lossy().into_owned();
        let modified = path
            .metadata()
            .ok()
            .and_then(|m| m.modified().ok())
            .and_then(|t| t.duration_since(std::time::UNIX_EPOCH).ok())
            .map(|d| d.as_millis() as u64)
            .unwrap_or(0);

        Some(NoteMetadata {
            name,
            path: path.to_string_lossy().into_owned(),
            modified,
        })
    }
}
