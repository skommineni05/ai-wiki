import React from "react";
import { getTransactions } from "../../services/api";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const TransactionsPage = () => {
  const [pageData, setPageData] = React.useState(null); // Spring Page object
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  // pagination state
  const [page, setPage] = React.useState(0);
  const [size] = React.useState(20);

  React.useEffect(() => {
    setLoading(true);
    setError(null);

    getTransactions(page, size)
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

  // chart data: first 10 transactions of this page
  const chartData = rows.slice(0, 10).map((tx) => ({
    name: tx.txnId,
    amount: tx.amount,
  }));

  const handlePrev = () => {
    if (page > 0) setPage(page - 1);
  };

  const handleNext = () => {
    if (pageData && !pageData.last) {
      setPage(page + 1);
    }
  };

  if (loading && !pageData) return <p>Loading transactions...</p>;
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
            <h2>Transactions</h2>
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
                  "Txn ID",
                  "User",
                  "Amount",
                  "Currency",
                  "Status",
                  "Method",
                  "Order",
                  "Latency (ms)",
                  "Timestamp",
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
              {rows.map((tx) => (
                <tr key={tx.txnId}>
                  <td style={tdStyle}>{tx.txnId}</td>
                  <td style={tdStyle}>{tx.userId}</td>
                  <td style={tdStyle}>{tx.amount}</td>
                  <td style={tdStyle}>{tx.currency}</td>
                  <td style={tdStyle}>{tx.status}</td>
                  <td style={tdStyle}>{tx.method}</td>
                  <td style={tdStyle}>{tx.orderId}</td>
                  <td style={tdStyle}>{tx.latencyMs}</td>
                  <td style={tdStyle}>{tx.ts}</td>
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
        <h3>Top 10 Transaction Amounts (this page)</h3>
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" hide />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" />
          </BarChart>
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

export default TransactionsPage;