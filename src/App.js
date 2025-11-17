import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/Home/HomePage";
import TransactionsPage from "./pages/Transactions/TransactionsPage";
import MemoryGcPage from "./pages/MemoryGc/MemoryGcPage";
import SearchPage from "./pages/Search/SearchPage";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/memory-gc" element={<MemoryGcPage />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;


