mod commands;
mod domain;
mod fs;
mod state;

use commands::notes::{create_note, delete_note, read_note, rename_note, save_note};
use commands::settings::{load_settings, save_settings};
use commands::workspace::{create_folder, scan_workspace};
use state::AppState;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .manage(AppState::new())
        .invoke_handler(tauri::generate_handler![
            scan_workspace,
            create_folder,
            read_note,
            save_note,
            create_note,
            delete_note,
            rename_note,
            load_settings,
            save_settings,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
