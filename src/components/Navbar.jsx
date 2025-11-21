import React from "react";
import { NavLink } from "react-router-dom";


const Navbar = () => {
  const linkStyle = ({ isActive }) => ({
    marginRight: "16px",
    textDecoration: "none",
    color: isActive ? "#2563eb" : "#111827",
    fontWeight: isActive ? "600" : "400",
  });

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        padding: "12px 24px",
        borderBottom: "1px solid #e5e7eb",
        backgroundColor: "#f9fafb",
      }}
    >
      <span style={{ fontWeight: 700, marginRight: "24px" }}>
        AI Wiki Dashboard
      </span>
      <NavLink to="/" style={linkStyle} end>
        Home
      </NavLink>
      <NavLink to="/transactions" style={linkStyle}>
        Transactions
      </NavLink>
      <NavLink to="/memory-gc" style={linkStyle}>
        Memory Logs
      </NavLink>
      <NavLink to="/search" style={linkStyle}>
        Search
      </NavLink>
      <NavLink to="/aisearch" style={linkStyle}>
        AiSearch
      </NavLink>
    </nav>
  );
};

export default Navbar;
