//import logo from './logo.svg';
import './App.css';
import SearchBar from "./searchbar";

export default function App() {
  const handleSearch = (q) => {
    console.log("Searching for:", q);
    // call your API here
  };

  return (
    <div className="center-wrapper" >
      <SearchBar onSearch={handleSearch} />
    </div>
  );
}


