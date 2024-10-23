import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
// import { WebsocketProvider } from 'y-websocket'
// import { IndexeddbPersistence } from "y-indexeddb";

const ydoc = new Y.Doc();
const protocol = "ws"; // window.location.protocol === "https" ? "wss" : "ws";

// this allows you to instantly get the (cached) documents data
// const indexeddbProvider = new IndexeddbPersistence("greeter-list", ydoc);

// Sync clients with the y-webrtc provider.
const webrtcProvider = new WebrtcProvider("tauri-greeter", ydoc, {
  signaling: [`${protocol}://localhost:8007/signaling`],
  password: "optional-room-password",
});
webrtcProvider.on("status", (args) => console.log(args));
webrtcProvider.on("peers", (args) => console.log(args));
webrtcProvider.on("synced", (args) => console.log(args));

// Sync clients with the y-websocket provider
// const websocketProvider = new WebsocketProvider(
//   'wss://demos.yjs.dev', 'count-demo', ydoc
// )

// array of numbers which produce a sum
const ymap = ydoc.getMap("greeters");
const yarray = ydoc.getArray<string>("greeted");

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
  <App ymap={ymap} yarray={yarray} idb={null} />
  // </React.StrictMode>
);
