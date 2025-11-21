import React from "react";
import { commandSearch } from "../../services/api";

/**
 * AI Search Page
 * - Chat-style interface for sending natural language commands
 * - Shows loading spinner while waiting
 * - Renders returned logs as Transaction / Memory GC tables
 */
function AiSearchPage() {
  const [input, setInput] = React.useState("");
  const [messages, setMessages] = React.useState([
    {
      id: 1,
      role: "assistant",
      text: "Hi! I can search your Transactions and Memory GC logs. Try something like:\n\n• Transaction results between the amount 40 and 70\n• Show failed transactions in the last 1 hour\n• Show memory gc logs with high heap usage",
    },
  ]);
  const [logs, setLogs] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();

    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      role: "user",
      text: userText,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const data = await commandSearch(userText);

      const assistantText =
        data.resultText ||
        "Here are the logs I found for your query. (No textual summary was returned.)";

      const assistantMessage = {
        id: Date.now() + 1,
        role: "assistant",
        text: assistantText,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setLogs(data.logs || []);
    } catch (err) {
      console.error("AI search error:", err);
      setError(err.message || "Something went wrong while calling AI search.");
    } finally {
      setLoading(false);
    }
  };

  // Separate logs into transactions vs memory GC, based on fields present
  const transactionLogs = Array.isArray(logs)
    ? logs.filter((log) => log && log.amount !== undefined)
    : [];

  const memoryGcLogs = Array.isArray(logs)
    ? logs.filter(
        (log) =>
          log &&
          (log.heapUsedMb !== undefined ||
            log.gcType !== undefined ||
            log.gcPauseMs !== undefined)
      )
    : [];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        padding: "16px",
        height: "calc(100vh - 80px)",
        boxSizing: "border-box",
      }}
    >
      {/* Local styles for spinner animation */}
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          .spinner {
            border: 4px solid #e5e7eb;
            border-top-color: #2563eb;
            border-radius: 9999px;
            width: 24px;
            height: 24px;
            animation: spin 1s linear infinite;
          }
        `}
      </style>

      <h1 style={{ fontSize: "1.5rem", marginBottom: "4px" }}>AI Search</h1>
      <p style={{ fontSize: "0.9rem", color: "#6b7280", marginBottom: "8px" }}>
        Type natural language commands to search Transactions and Memory GC
        logs. Example:
        <br />
        <code>Transaction results between the amount 40 and 70.</code>
      </p>

      {/* Chat panel */}
      <div
        style={{
          flex: 1,
          display: "flex",
          gap: "16px",
          minHeight: 0,
        }}
      >
        {/* Left: chat */}
        <div
          style={{
            flex: 1,
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "12px",
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
          }}
        >
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              paddingRight: "4px",
              marginBottom: "8px",
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: "flex",
                  justifyContent:
                    msg.role === "user" ? "flex-end" : "flex-start",
                  marginBottom: "8px",
                }}
              >
                <div
                  style={{
                    maxWidth: "80%",
                    padding: "8px 12px",
                    borderRadius: "12px",
                    backgroundColor:
                      msg.role === "user" ? "#2563eb" : "#e5e7eb",
                    color: msg.role === "user" ? "white" : "#111827",
                    whiteSpace: "pre-wrap",
                    fontSize: "0.9rem",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginTop: "4px",
                }}
              >
                <div className="spinner" />
                <span style={{ fontSize: "0.85rem", color: "#6b7280" }}>
                  Thinking...
                </span>
              </div>
            )}
          </div>

          {/* Input form */}
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", gap: "8px", marginTop: "4px" }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask the AI about transactions or memory GC..."
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #d1d5db",
                fontSize: "0.9rem",
              }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              style={{
                padding: "8px 16px",
                borderRadius: "4px",
                border: "none",
                backgroundColor: "#2563eb",
                color: "white",
                cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                opacity: loading || !input.trim() ? 0.6 : 1,
                fontSize: "0.9rem",
              }}
            >
              Send
            </button>
          </form>

          {error && (
            <div
              style={{
                marginTop: "6px",
                color: "#b91c1c",
                fontSize: "0.85rem",
              }}
            >
              {error}
            </div>
          )}
        </div>

        {/* Right: results tables */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {/* Transactions */}
          <div
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "8px",
              flex: 1,
              minHeight: 0,
              overflow: "hidden",
            }}
          >
            <h2
              style={{
                fontSize: "1rem",
                marginBottom: "4px",
                borderBottom: "1px solid #e5e7eb",
                paddingBottom: "4px",
              }}
            >
              Transaction Results ({transactionLogs.length})
            </h2>
            <div style={{ overflow: "auto", maxHeight: "100%" }}>
              {transactionLogs.length === 0 ? (
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "#6b7280",
                    marginTop: "4px",
                  }}
                >
                  No transactions matched this query.
                </p>
              ) : (
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "0.8rem",
                  }}
                >
                  <thead>
                    <tr>
                      <th style={thStyle}>Txn ID</th>
                      <th style={thStyle}>Amount</th>
                      <th style={thStyle}>Currency</th>
                      <th style={thStyle}>Status</th>
                      <th style={thStyle}>Method</th>
                      <th style={thStyle}>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactionLogs.map((t) => (
                      <tr key={t.txnId}>
                        <td style={tdStyle}>{t.txnId}</td>
                        <td style={tdStyle}>{t.amount}</td>
                        <td style={tdStyle}>{t.currency}</td>
                        <td style={tdStyle}>{t.status}</td>
                        <td style={tdStyle}>{t.method}</td>
                        <td style={tdStyle}>{t.ts}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Memory GC */}
          <div
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "8px",
              flex: 1,
              minHeight: 0,
              overflow: "hidden",
            }}
          >
            <h2
              style={{
                fontSize: "1rem",
                marginBottom: "4px",
                borderBottom: "1px solid #e5e7eb",
                paddingBottom: "4px",
              }}
            >
              Memory GC Results ({memoryGcLogs.length})
            </h2>
            <div style={{ overflow: "auto", maxHeight: "100%" }}>
              {memoryGcLogs.length === 0 ? (
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "#6b7280",
                    marginTop: "4px",
                  }}
                >
                  No memory GC logs matched this query.
                </p>
              ) : (
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "0.8rem",
                  }}
                >
                  <thead>
                    <tr>
                      <th style={thStyle}>ID</th>
                      <th style={thStyle}>Timestamp</th>
                      <th style={thStyle}>Heap Used (MB)</th>
                      <th style={thStyle}>Heap Committed (MB)</th>
                      <th style={thStyle}>GC Type</th>
                      <th style={thStyle}>GC Pause (ms)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {memoryGcLogs.map((m) => (
                      <tr key={m.id}>
                        <td style={tdStyle}>{m.id}</td>
                        <td style={tdStyle}>{m.ts}</td>
                        <td style={tdStyle}>{m.heapUsedMb}</td>
                        <td style={tdStyle}>{m.heapCommittedMb}</td>
                        <td style={tdStyle}>{m.gcType}</td>
                        <td style={tdStyle}>{m.gcPauseMs}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Small reusable cell styles
const thStyle = {
  textAlign: "left",
  padding: "4px 6px",
  borderBottom: "1px solid #e5e7eb",
  position: "sticky",
  top: 0,
  background: "#f9fafb",
};

const tdStyle = {
  padding: "4px 6px",
  borderBottom: "1px solid #f3f4f6",
};

export default AiSearchPage;