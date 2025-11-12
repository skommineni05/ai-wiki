import { useState } from "react";
import "./searchbar.css";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.(query);
  };

  return (
    <form className="search-container" onSubmit={handleSubmit}>
      <input
        type="text"
        className="search-input"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button className="search-button" type="submit">Search</button>
    </form>
  );
}
