import React from "react";
import {
  getAllTransactions,
  getAllMemoryGc,
} from "../../services/api";

const PAGE_SIZE = 20;

const SearchPage = () => {
  const [searchType, setSearchType] = React.useState("transactions"); // "transactions" | "memory"
  const [filters, setFilters] = React.useState({
    // transaction filters
    userId: "",
    status: "",
    currency: "",
    minAmount: "",
    maxAmount: "",
    // memory filters
    gcType: "",
    minHeapUsed: "",
    maxHeapUsed: "",
  });

  const [results, setResults] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [hasSearched, setHasSearched] = React.useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
    setResults([]);
    setCurrentPage(0);
    setHasSearched(false);
    setError(null);
  };

  const applyTransactionFilters = (data) => {
    return data.filter((tx) => {
      const {
        userId,
        status,
        currency,
        minAmount,
        maxAmount,
      } = filters;

      let ok = true;

      if (userId) {
        ok =
          ok &&
          tx.userId &&
          tx.userId.toLowerCase().includes(userId.toLowerCase());
      }

      if (status) {
        ok =
          ok &&
          tx.status &&
          tx.status.toLowerCase().includes(status.toLowerCase());
      }

      if (currency) {
        ok =
          ok &&
          tx.currency &&
          tx.currency.toLowerCase() === currency.toLowerCase();
      }

      if (minAmount) {
        const min = parseFloat(minAmount);
        if (!isNaN(min)) {
          ok = ok && parseFloat(tx.amount) >= min;
        }
      }

      if (maxAmount) {
        const max = parseFloat(maxAmount);
        if (!isNaN(max)) {
          ok = ok && parseFloat(tx.amount) <= max;
        }
      }

      return ok;
    });
  };

  const applyMemoryFilters = (data) => {
    return data.filter((row) => {
      const {
        gcType,
        minHeapUsed,
        maxHeapUsed,
      } = filters;

      let ok = true;

      if (gcType) {
        ok =
          ok &&
          row.gcType &&
          row.gcType.toLowerCase().includes(gcType.toLowerCase());
      }

      if (minHeapUsed) {
        const min = parseFloat(minHeapUsed);
        if (!isNaN(min)) {
          ok = ok && parseFloat(row.heapUsedMb) >= min;
        }
      }

      if (maxHeapUsed) {
        const max = parseFloat(maxHeapUsed);
        if (!isNaN(max)) {
          ok = ok && parseFloat(row.heapUsedMb) <= max;
        }
      }

      return ok;
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setHasSearched(true);
    setResults([]);
    setCurrentPage(0);

    try {
      if (searchType === "transactions") {
        const all = await getAllTransactions();
        const filtered = applyTransactionFilters(all);
        setResults(filtered);
      } else {
        const all = await getAllMemoryGc();
        const filtered = applyMemoryFilters(all);
        setResults(filtered);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(results.length / PAGE_SIZE);
  const pagedResults = results.slice(
    currentPage * PAGE_SIZE,
    currentPage * PAGE_SIZE + PAGE_SIZE
  );

  const goToPage = (pageIndex) => {
    if (pageIndex < 0 || pageIndex >= totalPages) return;
    setCurrentPage(pageIndex);
  };

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        padding: "16px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      }}
    >
      <h2>Search Logs</h2>
      <p style={{ color: "#6b7280" }}>
        Search within <strong>Transactions</strong> or <strong>Memory GC</strong> logs.
      </p>

      {/* Search type selector */}
      <div style={{ margin: "12px 0" }}>
        <label style={{ marginRight: "8px" }}>
          <input
            type="radio"
            value="transactions"
            checked={searchType === "transactions"}
            onChange={handleSearchTypeChange}
          />{" "}
          Transactions
        </label>
        <label style={{ marginLeft: "16px" }}>
          <input
            type="radio"
            value="memory"
            checked={searchType === "memory"}
            onChange={handleSearchTypeChange}
          />{" "}
          Memory GC
        </label>
      </div>

      {/* Filters form */}
      <form
        onSubmit={handleSearch}
        style={{
          display: "grid",
          gap: "12px",
          marginBottom: "16px",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        }}
      >
        {searchType === "transactions" && (
          <>
            <div>
              <label>User ID</label>
              <input
                type="text"
                name="userId"
                value={filters.userId}
                onChange={handleChange}
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label>Status</label>
              <input
                type="text"
                name="status"
                value={filters.status}
                onChange={handleChange}
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label>Currency</label>
              <input
                type="text"
                name="currency"
                value={filters.currency}
                onChange={handleChange}
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label>Min Amount</label>
              <input
                type="number"
                step="0.01"
                name="minAmount"
                value={filters.minAmount}
                onChange={handleChange}
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label>Max Amount</label>
              <input
                type="number"
                step="0.01"
                name="maxAmount"
                value={filters.maxAmount}
                onChange={handleChange}
                style={{ width: "100%" }}
              />
            </div>
          </>
        )}

        {searchType === "memory" && (
          <>
            <div>
              <label>GC Type</label>
              <input
                type="text"
                name="gcType"
                value={filters.gcType}
                onChange={handleChange}
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label>Min Heap Used (MB)</label>
              <input
                type="number"
                step="0.01"
                name="minHeapUsed"
                value={filters.minHeapUsed}
                onChange={handleChange}
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label>Max Heap Used (MB)</label>
              <input
                type="number"
                step="0.01"
                name="maxHeapUsed"
                value={filters.maxHeapUsed}
                onChange={handleChange}
                style={{ width: "100%" }}
              />
            </div>
          </>
        )}

        <div style={{ alignSelf: "end" }}>
          <button type="submit" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>

      {/* Results */}
      {error && (
        <p style={{ color: "red", marginBottom: "8px" }}>Error: {error}</p>
      )}

      {hasSearched && !loading && results.length === 0 && (
        <p>No results found for the given filters.</p>
      )}

      {results.length > 0 && (
        <>
          <p style={{ color: "#6b7280" }}>
            Showing {pagedResults.length} of {results.length} filtered results
            (page {currentPage + 1} of {totalPages})
          </p>

          <div style={{ overflowX: "auto", marginTop: "8px" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr>
                  {searchType === "transactions" ? (
                    <>
                      <th style={thStyle}>Txn ID</th>
                      <th style={thStyle}>User ID</th>
                      <th style={thStyle}>Amount</th>
                      <th style={thStyle}>Currency</th>
                      <th style={thStyle}>Status</th>
                      <th style={thStyle}>Method</th>
                      <th style={thStyle}>Order ID</th>
                      <th style={thStyle}>Latency (ms)</th>
                      <th style={thStyle}>Timestamp</th>
                    </>
                  ) : (
                    <>
                      <th style={thStyle}>ID</th>
                      <th style={thStyle}>Timestamp</th>
                      <th style={thStyle}>Heap Used (MB)</th>
                      <th style={thStyle}>Heap Committed (MB)</th>
                      <th style={thStyle}>Non-Heap Used (MB)</th>
                      <th style={thStyle}>GC Type</th>
                      <th style={thStyle}>GC Pause (ms)</th>
                      <th style={thStyle}>Young Gen (MB)</th>
                      <th style={thStyle}>Old Gen (MB)</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {pagedResults.map((row) =>
                  searchType === "transactions" ? (
                    <tr key={row.txnId}>
                      <td style={tdStyle}>{row.txnId}</td>
                      <td style={tdStyle}>{row.userId}</td>
                      <td style={tdStyle}>{row.amount}</td>
                      <td style={tdStyle}>{row.currency}</td>
                      <td style={tdStyle}>{row.status}</td>
                      <td style={tdStyle}>{row.method}</td>
                      <td style={tdStyle}>{row.orderId}</td>
                      <td style={tdStyle}>{row.latencyMs}</td>
                      <td style={tdStyle}>{row.ts}</td>
                    </tr>
                  ) : (
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
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* Simple pagination */}
          <div style={{ marginTop: "8px" }}>
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 0}
              style={{ marginRight: "8px" }}
            >
              Previous
            </button>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage + 1 >= totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const thStyle = {
  textAlign: "left",
  borderBottom: "1px solid #e5e7eb",
  padding: "8px",
  fontSize: "0.85rem",
  color: "#6b7280",
};

const tdStyle = {
  padding: "8px",
  borderBottom: "1px solid #f3f4f6",
};

export default SearchPage;