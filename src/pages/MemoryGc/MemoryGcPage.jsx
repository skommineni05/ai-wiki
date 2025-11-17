import React from "react";
import { getMemoryGc } from "../../services/api";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const MemoryGcPage = () => {
  const [pageData, setPageData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  // pagination state
  const [page, setPage] = React.useState(0);
  const [size] = React.useState(50);

  React.useEffect(() => {
    setLoading(true);
    setError(null);

    getMemoryGc(page, size)
      .then((data) => {
        setPageData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, [page, size]);

  const rows = pageData?.content || [];

  const chartData = rows.map((row) => ({
    ts: row.ts,
    heapUsedMb: row.heapUsedMb,
  }));

  const handlePrev = () => {
    if (page > 0) setPage(page - 1);
  };

  const handleNext = () => {
    if (pageData && !pageData.last) {
      setPage(page + 1);
    }
  };

  if (loading && !pageData) return <p>Loading memory logs...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div style={{ display: "grid", gap: "16px" }}>
      {/* TABLE CARD */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          padding: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <div>
            <h2>Memory GC Logs</h2>
            {pageData && (
              <p style={{ color: "#6b7280" }}>
                Showing {rows.length} of {pageData.totalElements} records (page{" "}
                {pageData.number + 1} of {pageData.totalPages})
              </p>
            )}
          </div>

          {/* Pagination controls */}
          {pageData && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button
                onClick={handlePrev}
                disabled={page === 0}
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "1px solid #d1d5db",
                  backgroundColor: page === 0 ? "#e5e7eb" : "#ffffff",
                  cursor: page === 0 ? "not-allowed" : "pointer",
                }}
              >
                Prev
              </button>
              <span style={{ fontSize: "0.85rem", color: "#4b5563" }}>
                Page {pageData.number + 1} / {pageData.totalPages}
              </span>
              <button
                onClick={handleNext}
                disabled={pageData.last}
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "1px solid #d1d5db",
                  backgroundColor: pageData.last ? "#e5e7eb" : "#ffffff",
                  cursor: pageData.last ? "not-allowed" : "pointer",
                }}
              >
                Next
              </button>
            </div>
          )}
        </div>

        <div style={{ overflowX: "auto", marginTop: "12px" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr>
                {[
                  "ID",
                  "Timestamp",
                  "Heap Used (MB)",
                  "Heap Committed (MB)",
                  "Non-Heap Used (MB)",
                  "GC Type",
                  "GC Pause (ms)",
                  "Young Gen (MB)",
                  "Old Gen (MB)",
                ].map((header) => (
                  <th
                    key={header}
                    style={{
                      textAlign: "left",
                      borderBottom: "1px solid #e5e7eb",
                      padding: "8px",
                      fontSize: "0.85rem",
                      color: "#6b7280",
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td style={tdStyle}>{row.id}</td>
                  <td style={tdStyle}>{row.ts}</td>
                  <td style={tdStyle}>{row.heapUsedMb}</td>
                  <td style={tdStyle}>{row.heapCommittedMb}</td>
                  <td style={tdStyle}>{row.nonheapUsedMb}</td>
                  <td style={tdStyle}>{row.gcType}</td>
                  <td style={tdStyle}>{row.gcPauseMs}</td>
                  <td style={tdStyle}>{row.youngGenMb}</td>
                  <td style={tdStyle}>{row.oldGenMb}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CHART CARD */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          padding: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          height: "320px",
        }}
      >
        <h3>Heap Usage Over Time (this page)</h3>
        <ResponsiveContainer width="100%" height="90%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="ts" hide />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="heapUsedMb" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const tdStyle = {
  padding: "8px",
  borderBottom: "1px solid #f3f4f6",
  fontSize: "0.9rem",
};

export default MemoryGcPage;