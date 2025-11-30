"use client";

import { useState } from "react";
import styles from "./page.module.css";
import CountryCitySelector from "@/components/CountryCitySelector";
import WeatherCard from "@/components/WeatherCard";

export default function ExplorarPage() {
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
      
      // Guardar en ciudades recientes
      saveRecentCity(data);
    } catch (err) {
      setError(err.message);
      setWeather(null);
    } finally {
      setIsLoading(false);
    }
  };

  const saveRecentCity = (weatherData) => {
    const iconMap = {
      "01": "☀️",
      "02": "⛅",
      "03": "☁️",
      "04": "☁️",
      "09": "🌧️",
      "10": "🌦️",
      "11": "⛈️",
      "13": "❄️",
      "50": "🌫️",
    };
    
    const iconCode = weatherData.icon.substring(0, 2);
    const cityData = {
      name: weatherData.city,
      region: weatherData.country,
      temp: weatherData.temperature,
      icon: iconMap[iconCode] || "🌤️",
    };

    const saved = localStorage.getItem("recentCities");
    let cities = saved ? JSON.parse(saved) : [];
    
    // Remover si ya existe
    cities = cities.filter(c => c.name.toLowerCase() !== cityData.name.toLowerCase());
    
    // Agregar al inicio
    cities.unshift(cityData);
    
    // Mantener solo las últimas 5
    cities = cities.slice(0, 5);
    
    localStorage.setItem("recentCities", JSON.stringify(cities));
    
    // Disparar evento para actualizar el header
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>🗺️ Explorar por País y Ciudad</h1>
        <p className={styles.subtitle}>
          Selecciona un país de la lista y luego elige una de sus principales ciudades para consultar el clima
        </p>
      </div>

      <CountryCitySelector onSearch={searchWeather} isLoading={isLoading} />

      {error && (
        <div className={styles.error}>
          <span>⚠️</span> {error}
        </div>
      )}

      {weather && <WeatherCard weather={weather} />}

      {!weather && !error && !isLoading && (
        <div className={styles.placeholder}>
          <span className={styles.placeholderIcon}>🌍</span>
          <p>Selecciona un país y ciudad para ver el clima</p>
        </div>
      )}
    </div>
  );
}
