use crate::domain::file_tree::{FileNode, FileNodeKind};
use std::path::Path;

const IGNORED_DIRS: &[&str] = &[
    ".git",
    ".obsidian",
    "node_modules",
    ".trash",
    ".Trash",
    "target",
];

const IGNORED_FILES: &[&str] = &[".DS_Store"];

fn should_ignore_dir(name: &str) -> bool {
    if name.starts_with('.') {
        return true;
    }
    IGNORED_DIRS.contains(&name)
}

fn should_ignore_file(name: &str) -> bool {
    IGNORED_FILES.contains(&name)
}

/// Recursively scan a directory.
/// Uses symlink_metadata() to avoid following symlinks — prevents cycles and
/// path escapes via symlinks pointing outside the workspace.
pub fn scan_directory(root: &Path) -> Vec<FileNode> {
    let mut result = Vec::new();

    let Ok(entries) = std::fs::read_dir(root) else {
        return result;
    };

    let mut dirs: Vec<FileNode> = Vec::new();
    let mut files: Vec<FileNode> = Vec::new();

    for entry in entries.flatten() {
        let path = entry.path();

        let name = match entry.file_name().into_string() {
            Ok(n) => n,
            Err(_) => continue,
        };

        // Use symlink_metadata so we never follow symlinks
        let meta = match std::fs::symlink_metadata(&path) {
            Ok(m) => m,
            Err(_) => continue,
        };

        // Skip symlinks entirely
        if meta.file_type().is_symlink() {
            continue;
        }

        if meta.is_dir() {
            if should_ignore_dir(&name) {
                continue;
            }
            let children = scan_directory(&path);
            if !children.is_empty() {
                dirs.push(FileNode {
                    name,
                    path: path.to_string_lossy().into_owned(),
                    kind: FileNodeKind::Dir,
                    children: Some(children),
                });
            }
        } else if meta.is_file() {
            if should_ignore_file(&name) {
                continue;
            }
            if name.ends_with(".md") {
                files.push(FileNode {
                    name,
                    path: path.to_string_lossy().into_owned(),
                    kind: FileNodeKind::File,
                    children: None,
                });
            }
        }
    }

    dirs.sort_by_key(|n| n.name.to_lowercase());
    files.sort_by_key(|n| n.name.to_lowercase());

    result.extend(dirs);
    result.extend(files);
    result
}
