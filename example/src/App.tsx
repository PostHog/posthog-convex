import "./App.css";
import { useAction, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { useState } from "react";

function App() {
  const [distinctId, setDistinctId] = useState("user-123");
  const [event, setEvent] = useState("test_event");
  const [flagKey, setFlagKey] = useState("test-flag");
  const [log, setLog] = useState<string[]>([]);

  const addLog = (msg: string) =>
    setLog((prev) => [...prev, `${new Date().toLocaleTimeString()} ${msg}`]);

  // Fire-and-forget mutations
  const captureM = useMutation(api.example.testCapture);
  const identifyM = useMutation(api.example.testIdentify);
  const groupIdentifyM = useMutation(api.example.testGroupIdentify);
  const aliasM = useMutation(api.example.testAlias);

  // Feature flag actions
  const getFeatureFlagA = useAction(api.example.testGetFeatureFlag);
  const isFeatureEnabledA = useAction(api.example.testIsFeatureEnabled);
  const getPayloadA = useAction(api.example.testGetFeatureFlagPayload);
  const getResultA = useAction(api.example.testGetFeatureFlagResult);
  const getAllFlagsA = useAction(api.example.testGetAllFlags);
  const getAllFlagsPayloadsA = useAction(
    api.example.testGetAllFlagsAndPayloads,
  );

  const run = async (label: string, fn: () => Promise<unknown>) => {
    addLog(`${label}...`);
    try {
      const result = await fn();
      addLog(`${label} -> ${JSON.stringify(result)}`);
    } catch (e) {
      addLog(`${label} ERROR: ${e}`);
    }
  };

  return (
    <>
      <h1>PostHog Convex Component</h1>

      <div className="card">
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>
          <label>
            Distinct ID
            <input value={distinctId} onChange={(e) => setDistinctId(e.target.value)} style={{ marginLeft: "0.5rem" }} />
          </label>
          <label>
            Event name
            <input value={event} onChange={(e) => setEvent(e.target.value)} style={{ marginLeft: "0.5rem" }} />
          </label>
          <label>
            Flag key
            <input value={flagKey} onChange={(e) => setFlagKey(e.target.value)} style={{ marginLeft: "0.5rem" }} />
          </label>
        </div>

        <h3>Fire-and-forget (mutations)</h3>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
          <button onClick={() => run("capture", () => captureM({ distinctId, event }))}>
            capture
          </button>
          <button onClick={() => run("identify", () => identifyM({ distinctId }))}>
            identify
          </button>
          <button onClick={() => run("groupIdentify", () => groupIdentifyM({ groupType: "company", groupKey: "acme" }))}>
            groupIdentify
          </button>
          <button onClick={() => run("alias", () => aliasM({ distinctId, alias: "anon-456" }))}>
            alias
          </button>
        </div>

        <h3>Feature flags (actions)</h3>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
          <button onClick={() => run("getFeatureFlag", () => getFeatureFlagA({ distinctId, flagKey }))}>
            getFeatureFlag
          </button>
          <button onClick={() => run("isFeatureEnabled", () => isFeatureEnabledA({ distinctId, flagKey }))}>
            isFeatureEnabled
          </button>
          <button onClick={() => run("getFeatureFlagPayload", () => getPayloadA({ distinctId, flagKey }))}>
            getFeatureFlagPayload
          </button>
          <button onClick={() => run("getFeatureFlagResult", () => getResultA({ distinctId, flagKey }))}>
            getFeatureFlagResult
          </button>
          <button onClick={() => run("getAllFlags", () => getAllFlagsA({ distinctId }))}>
            getAllFlags
          </button>
          <button onClick={() => run("getAllFlagsAndPayloads", () => getAllFlagsPayloadsA({ distinctId }))}>
            getAllFlagsAndPayloads
          </button>
        </div>

        <h3>Log</h3>
        <pre style={{ textAlign: "left", maxHeight: "300px", overflow: "auto", fontSize: "0.8rem" }}>
          {log.length ? log.join("\n") : "Click a button to test..."}
        </pre>
        <button onClick={() => setLog([])} style={{ marginTop: "0.5rem" }}>
          Clear log
        </button>
      </div>
    </>
  );
}

export default App;
