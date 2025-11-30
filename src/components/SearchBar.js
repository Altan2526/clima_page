"use client";

import { useState } from "react";
import styles from "./SearchBar.module.css";

export default function SearchBar({ onSearch, isLoading }) {
  const [city, setCity] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
    }
  };

  return (
    <form className={styles.searchForm} onSubmit={handleSubmit}>
      <div className={styles.inputWrapper}>
        <span className={styles.searchIcon}>🔍</span>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Buscar ciudad..."
          className={styles.input}
          disabled={isLoading}
        />
      </div>
      <button type="submit" className={styles.button} disabled={isLoading}>
        {isLoading ? (
          <span className={styles.loader}></span>
        ) : (
          "Buscar"
        )}
      </button>
    </form>
  );
}
