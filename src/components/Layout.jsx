import React from "react";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f3f4f6" }}>
      <Navbar />
      <main style={{ padding: "16px 24px" }}>{children}</main>
    </div>
  );
};

export default Layout;
