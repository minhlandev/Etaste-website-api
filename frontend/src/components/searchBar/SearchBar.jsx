import { useState } from "react";
import "./searchBar.scss";
import { Link } from "react-router-dom";

const types = ["any", "buy", "rent"];
const properties = ["any", "apartment", "house", "condo", "land"];

function SearchBar() {
  const [query, setQuery] = useState({
    type: "any",
    property: "any",
    city: "",
    minPrice: 0,
    maxPrice: 0,
  });

  const switchType = (val) => {
    setQuery((prev) => ({ ...prev, type: val }));
  };

  const handleChange = (e) => {
    setQuery((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const getSearchUrl = () => {
    const baseUrl = "/list?";
    const params = new URLSearchParams();

    if (query.type !== "any") {
      params.append("type", query.type);
    }
    if (query.property !== "any") {
      params.append("property", query.property);
    }
    if (query.city) params.append("city", query.city);
    if (query.minPrice > 0) params.append("minPrice", query.minPrice);
    if (query.maxPrice > 0) params.append("maxPrice", query.maxPrice);

    return baseUrl + params.toString();
  };

  return (
    <div className="searchBar">
      <div className="type">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => switchType(type)}
            className={query.type === type ? "active" : ""}
          >
            {type}
          </button>
        ))}
      </div>
      <form>
        <select 
          name="property" 
          value={query.property}
          onChange={handleChange}
          className="property-select"
        >
          {properties.map((property) => (
            <option key={property} value={property}>
              {property === "any" 
                ? "Any Property" 
                : property.charAt(0).toUpperCase() + property.slice(1)}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="city"
          placeholder="City"
          onChange={handleChange}
        />
        <input
          type="number"
          name="minPrice"
          min={0}
          max={10000000}
          placeholder="Min Price"
          onChange={handleChange}
        />
        <input
          type="number"
          name="maxPrice"
          min={0}
          max={10000000}
          placeholder="Max Price"
          onChange={handleChange}
        />
        <Link to={getSearchUrl()}>
          <button>
            <img src="/search.png" alt="" />
          </button>
        </Link>
      </form>
    </div>
  );
}

export default SearchBar;
