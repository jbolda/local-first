import React from "react";
import ReactDOM from "react-dom/client";
import App, { type TaskList } from "./App.tsx";

import "./main.css";
import { isValidAutomergeUrl, Repo } from "@automerge/automerge-repo";
import { BrowserWebSocketClientAdapter } from "@automerge/automerge-repo-network-websocket";
import { IndexedDBStorageAdapter } from "@automerge/automerge-repo-storage-indexeddb";
import { RepoContext } from "@automerge/automerge-repo-react-hooks";

const repo = new Repo({
  network: [new BrowserWebSocketClientAdapter("wss://sync.automerge.org")],
  storage: new IndexedDBStorageAdapter(),
});

const rootDocUrl = `${document.location.hash.substring(1)}`;
console.log({
  location: document.location,
  hash: document.location.hash,
  rootDocUrl,
});
let handle;
if (isValidAutomergeUrl(rootDocUrl)) {
  handle = repo.find(rootDocUrl);
} else {
  handle = repo.create<TaskList>({ tasks: [] });
}
const docUrl = (document.location.hash = handle.url);
repo.addListener("document", (arg) => console.log(arg));
console.log(repo.handles);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div />
    <RepoContext.Provider value={repo}>
      <App docUrl={docUrl} />
    </RepoContext.Provider>
  </React.StrictMode>
);
