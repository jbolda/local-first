import { useEffect, useState } from "react";
import "./App.css";
import { Container, LoroDoc, type LoroList } from "loro-crdt";

function View({
  doc,
  snapshot,
}: {
  doc: LoroDoc<Record<string, Container>>;
  snapshot: Uint8Array;
}) {
  const [jsonDoc, setJsonDoc] = useState(null);
  doc.setPeerId("1");
  const list: LoroList = doc.getList("list");

  useEffect(() => {
    console.log("established");
    list.subscribe((event) => {
      console.log(event);
      setJsonDoc(list.toJSON());
    });
  }, []);

  return (
    <>
      <h1>Vite + React</h1>
      <div className="card">
        <button
          onClick={() => {
            console.log("hello chat");
            list.push(0);
            list.push(1);
            list.push(2);
            list.insert(0, "whelp");
            console.log("hello again chat");
            doc.commit();
          }}
        >
          Add A
        </button>
      </div>
      <p>{snapshot}</p>
      <Item listJSON={jsonDoc} />
    </>
  );
}

function Item({ listJSON }: { listJSON: JSON }) {
  return <pre>{JSON.stringify(listJSON, null, 2)}</pre>;
}

function App() {
  const doc = new LoroDoc();
  const bytes: Uint8Array = doc.export({ mode: "snapshot" });

  return <View doc={doc} snapshot={bytes} />;
}

export default App;
