import React from "react";
import ReactDOM from "react-dom/client";
import App, { type TaskList } from "./App.tsx";

import "./main.css";
import {
  isValidAutomergeUrl,
  Repo,
  DocHandle,
} from "@automerge/automerge-repo";
import { BroadcastChannelNetworkAdapter } from "@automerge/automerge-repo-network-broadcastchannel";
import { BrowserWebSocketClientAdapter } from "@automerge/automerge-repo-network-websocket";
import { IndexedDBStorageAdapter } from "@automerge/automerge-repo-storage-indexeddb";
import { RepoContext } from "@automerge/automerge-repo-react-hooks";

const repo = new Repo({
  network: [
    // new BroadcastChannelNetworkAdapter(),
    new BrowserWebSocketClientAdapter("wss://sync.automerge.org"),
  ],
  storage: new IndexedDBStorageAdapter(),
});

// Add the repo to the global window object so it can be accessed in the browser console
// This is useful for debugging and testing purposes.
declare global {
  interface Window {
    repo: Repo;
    // We also add the handle to the global window object for debugging
    handle: DocHandle<TaskList>;
  }
}
window.repo = repo;

const rootDocUrl = document.location.hash.substring(1);
console.log({
  location: document.location,
  hash: document.location.hash,
  rootDocUrl,
});
if (isValidAutomergeUrl(rootDocUrl)) {
  window.handle = await repo.find(rootDocUrl);
} else {
  window.handle = repo.create<TaskList>({ tasks: [] });
  document.location.hash = window.handle.url;
}
repo.addListener("document", (arg) => console.log(arg));

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div />
    <RepoContext.Provider value={repo}>
      <App docUrl={window.handle.url} />
    </RepoContext.Provider>
  </React.StrictMode>
);
