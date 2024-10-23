import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
// import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import * as Y from "yjs";
import { invoke } from "@tauri-apps/api/core";

function App({
  ymap,
  yarray,
  idb,
}: {
  ymap: Y.Map<unknown>;
  yarray: Y.Array<string>;
  idb: any;
}) {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("none");
  // this is simply a cheap way to get the view to re-render and update
  const [lastUpdate, setLastUpdate] = useState(0);
  if (idb)
    idb.whenSynced.then(() => {
      console.log("loaded data from indexed db");
      setLastUpdate(Date.now());
    });

  useEffect(() => {
    // observe changes of the sum
    ymap.observe((event) => {
      // print updates when the data changes
      console.log({ ymapEvent: event });
      setLastUpdate(Date.now());
    });
    yarray.observe((event) => {
      // print updates when the data changes
      console.log({ yarrayEvent: event });
      setLastUpdate(Date.now());
    });
  }, []);

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name }));
    ymap.set(
      name,
      `Greetings ${name}, saying hi from a ymap at timestamp ${Date.now()}`
    );
    yarray.push([`greeted ${name}`]);
  }

  return (
    <div className="container">
      <h1>Welcome to Tauri!</h1>

      <div className="row">
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo vite" alt="Vite logo" />
        </a>
        <a href="https://tauri.app" target="_blank">
          <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <p>Click on the Tauri, Vite, and React logos to learn more.</p>

      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit">Greet</button>
      </form>

      <p>{greetMsg}</p>
      <pre>{`${JSON.stringify(ymap.toJSON(), null, 2)}`}</pre>
      <pre>{`${JSON.stringify(yarray.toJSON(), null, 2)}`}</pre>

      <button onClick={() => invoke("start_signaling_server", { name })}>
        Connect
      </button>
    </div>
  );
}

export default App;
