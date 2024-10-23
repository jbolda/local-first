use warp::ws::{WebSocket, Ws};
use warp::{Filter, Rejection, Reply};
use yrs_warp::signaling::{signaling_conn, SignalingService};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn start_signaling_server() {
    let signaling = SignalingService::new();
    let ws = warp::path("signaling")
        .and(warp::ws())
        .and(warp::any().map(move || signaling.clone()))
        .and_then(ws_handler);

    tauri::async_runtime::spawn(async move {
        warp::serve(ws).run(([0, 0, 0, 0], 8007)).await;
    });
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![greet, start_signaling_server])
        // we could set it up here, but then it is enabled by default for everyone using it
        // .setup(move |app| {
        //     let signaling = SignalingService::new();
        //     let ws = warp::path("signaling")
        //         .and(warp::ws())
        //         .and(warp::any().map(move || signaling.clone()))
        //         .and_then(ws_handler);
        //     #[cfg(desktop)]
        //     tauri::async_runtime::spawn(async move {
        //         warp::serve(ws).run(([0, 0, 0, 0], 8007)).await;
        //     });
        //     Ok(())
        // })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

async fn ws_handler(ws: Ws, svc: SignalingService) -> Result<impl Reply, Rejection> {
    Ok(ws.on_upgrade(move |socket| peer(socket, svc)))
}
async fn peer(ws: WebSocket, svc: SignalingService) {
    match signaling_conn(ws, svc).await {
        Ok(_) => println!("signaling connection stopped"),
        Err(e) => eprintln!("signaling connection failed: {}", e),
    }
}
