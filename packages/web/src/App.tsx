import { useEffect, useState } from "react";
import logo from "@/logo.svg";
import "@/App.scss";
import { Dummy } from "@/components/dummy";
import { getText } from "@/lib/get-text-client";

export default function App() {
  const [count, setCount] = useState(0);
  const [data, setData] = useState<string | null>(null);

  async function loadData() {
    const data = await getText({ text: "payload" });
    setData(data);
  }

  useEffect(() => {
    loadData().catch(() => {
      // ignore
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello Vite + React!</p>
        <p>
          <button type="button" onClick={() => setCount((count) => count + 1)}>
            count is: {count}
          </button>
        </p>
        <p>
          Edit <code>App.tsx</code> and save to test HMR updates.
        </p>
        <p>{data ? data : "Loading..."}</p>
        <Dummy foo={"reee"} />
        <p>
          <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
            Learn React
          </a>
          {" | "}
          <a className="App-link" href="https://vitejs.dev/guide/features.html" target="_blank" rel="noopener noreferrer">
            Vite Docs
          </a>
        </p>
      </header>
    </div>
  );
}
