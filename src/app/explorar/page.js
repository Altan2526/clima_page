"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import CountryCitySelector from "@/components/CountryCitySelector";
import WeatherCard from "@/components/WeatherCard";

export default function ExplorarPage() {
  const router = useRouter();
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const searchWeather = async (city) => {
    setIsLoading(true);
    setError(null);

    try {
      // Obtener clima actual y pronóstico en paralelo
      const [weatherResponse, forecastResponse] = await Promise.all([
        fetch(`/api/weather?city=${encodeURIComponent(city)}`),
        fetch(`/api/forecast?city=${encodeURIComponent(city)}`)
      ]);
      
      const weatherData = await weatherResponse.json();
      const forecastData = await forecastResponse.json();

      if (!weatherResponse.ok) {
        throw new Error(weatherData.error || "Error al obtener el clima");
      }

      setWeather(weatherData);
      
      // Procesar pronóstico de 5 días
      if (forecastResponse.ok && forecastData.forecast) {
        setForecast(forecastData.forecast.slice(0, 5));
      }
      
      // Guardar en ciudades recientes
      saveRecentCity(weatherData);
    } catch (err) {
      setError(err.message);
      setWeather(null);
      setForecast([]);
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

  const getWeatherIcon = (icon) => {
    const iconMap = {
      "01d": "☀️", "01n": "🌙",
      "02d": "⛅", "02n": "☁️",
      "03d": "☁️", "03n": "☁️",
      "04d": "☁️", "04n": "☁️",
      "09d": "🌧️", "09n": "🌧️",
      "10d": "🌦️", "10n": "🌧️",
      "11d": "⛈️", "11n": "⛈️",
      "13d": "❄️", "13n": "❄️",
      "50d": "🌫️", "50n": "🌫️",
    };
    return iconMap[icon] || "🌤️";
  };

  const getDayLabel = (dateString, index) => {
    if (index === 0) return "Hoy";
    if (index === 1) return "Mañana";
    
    // Parsear la fecha correctamente para evitar desfase de zona horaria
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    return days[date.getDay()];
  };

  const formatDate = (dateString) => {
    // Parsear la fecha correctamente para evitar desfase de zona horaria
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    return `${date.getDate()} ${months[date.getMonth()]}`;
  };

  const handleDayClick = (day) => {
    if (weather) {
      router.push(`/pronostico/dia?city=${encodeURIComponent(weather.city)}&date=${day.date}`);
    }
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

      {/* Pronóstico de 5 días */}
      {weather && forecast.length > 0 && (
        <div className={styles.forecastSection}>
          <h2 className={styles.forecastTitle}>📅 Pronóstico de 5 días</h2>
          <div className={styles.forecastGrid}>
            {forecast.map((day, index) => (
              <div 
                key={day.date} 
                className={styles.forecastCard}
                onClick={() => handleDayClick(day)}
              >
                <div className={styles.forecastDay}>
                  <span className={styles.dayName}>{getDayLabel(day.date, index)}</span>
                  <span className={styles.dayDate}>{formatDate(day.date)}</span>
                </div>
                <div className={styles.forecastIcon}>
                  {getWeatherIcon(day.icon)}
                </div>
                <div className={styles.forecastTemps}>
                  <span className={styles.tempMax}>{day.tempMax}°</span>
                  <span className={styles.tempMin}>{day.tempMin}°</span>
                </div>
                <div className={styles.forecastDesc}>
                  {day.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!weather && !error && !isLoading && (
        <div className={styles.placeholder}>
          <span className={styles.placeholderIcon}>🌍</span>
          <p>Selecciona un país y ciudad para ver el clima</p>
        </div>
      )}
    </div>
  );
}
