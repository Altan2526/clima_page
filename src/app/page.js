"use client";

import { useState } from "react";
import styles from "./page.module.css";
import SearchBar from "@/components/SearchBar";
import WeatherCard from "@/components/WeatherCard";

export default function Home() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const searchWeather = async (city) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/weather?city=${encodeURIComponent(city)}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al obtener el clima");
      }

      setWeather(data);
    } catch (err) {
      setError(err.message);
      setWeather(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>🌤️ Clima App</h1>
          <p className={styles.subtitle}>
            Consulta el clima de cualquier ciudad del mundo
          </p>
        </div>

        <SearchBar onSearch={searchWeather} isLoading={isLoading} />

        {error && (
          <div className={styles.error}>
            <span>⚠️</span> {error}
          </div>
        )}

        {weather && <WeatherCard weather={weather} />}

        {!weather && !error && !isLoading && (
          <div className={styles.placeholder}>
            <span className={styles.placeholderIcon}>🌍</span>
            <p>Busca una ciudad para ver el clima actual</p>
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <p>
          Datos proporcionados por{" "}
          <a
            href="https://openweathermap.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            OpenWeather
          </a>
        </p>
      </footer>
    </div>
  );
}
