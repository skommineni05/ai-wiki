import React from "react";

const HomePage = () => {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        padding: "24px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      }}
    >
      <h2>Welcome to AI Wiki Dashboard</h2>
      <p>
        Use the navigation bar to view <strong>Transactions</strong> and{" "}
        <strong>Memory Logs</strong> coming from your Spring Boot + MySQL backend.
      </p>
      <ul>
        <li><strong>Transactions</strong>: Data from <code>/api/transactions</code></li>
        <li><strong>Memory Logs</strong>: Data from <code>/api/memory-gc</code></li>
        <li><strong>Search</strong>: Search within Transactions and Memory Logs</li>
      </ul>
    </div>
  );
};

export default HomePage;
