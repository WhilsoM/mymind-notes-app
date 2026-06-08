use serde::{Deserialize, Serialize};
use std::path::PathBuf;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AppSettings {
    pub theme: String,
    pub accent_color: String,
    pub compact_mode: bool,
    pub sidebar_width: u32,
    pub last_workspace_path: Option<String>,
    pub autosave_delay_ms: u32,
}

impl Default for AppSettings {
    fn default() -> Self {
        AppSettings {
            theme: "system".to_string(),
            accent_color: "#8b6cff".to_string(),
            compact_mode: false,
            sidebar_width: 280,
            last_workspace_path: None,
            autosave_delay_ms: 600,
        }
    }
}

fn settings_path() -> PathBuf {
    dirs::config_dir()
        .unwrap_or_else(|| PathBuf::from("."))
        .join("mymind-notes")
        .join("settings.json")
}

#[tauri::command]
pub fn load_settings() -> AppSettings {
    let path = settings_path();
    if !path.exists() {
        return AppSettings::default();
    }
    let Ok(content) = std::fs::read_to_string(&path) else {
        return AppSettings::default();
    };
    serde_json::from_str(&content).unwrap_or_default()
}

#[tauri::command]
pub fn save_settings(settings: AppSettings) -> Result<(), String> {
    let path = settings_path();
    if let Some(parent) = path.parent() {
        std::fs::create_dir_all(parent).map_err(|e| format!("Cannot create config dir: {e}"))?;
    }
    let json = serde_json::to_string_pretty(&settings)
        .map_err(|e| format!("Cannot serialize settings: {e}"))?;
    std::fs::write(&path, json).map_err(|e| format!("Cannot write settings: {e}"))
}
