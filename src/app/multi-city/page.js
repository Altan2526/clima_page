"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import styles from "./page.module.css";

function ForecastContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [cityInput, setCityInput] = useState("");
  const [forecastData, setForecastData] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  // Cargar ciudad desde URL solo al inicio
  useEffect(() => {
    if (initialLoad) {
      const cityFromUrl = searchParams.get("city");
      if (cityFromUrl) {
        setCityInput(cityFromUrl);
        fetchForecast(cityFromUrl);
      }
      setInitialLoad(false);
    }
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      fetchForecast(cityInput);
    }
  };

  const fetchForecast = async (city) => {
    const searchCity = city || cityInput;
    if (!searchCity.trim()) return;

    setIsLoading(true);
    setError("");
    setForecastData(null);

    try {
      const response = await fetch(
        `/api/forecast?city=${encodeURIComponent(searchCity.trim())}`
      );
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Error al obtener el pronóstico");
      } else {
        setForecastData(data);
        // Actualizar URL sin recargar
        window.history.replaceState({}, "", `/multi-city?city=${encodeURIComponent(searchCity.trim())}`);
      }
    } catch (err) {
      setError("Error de conexión");
    }

    setIsLoading(false);
  };

  const handleDayClick = (day) => {
    if (forecastData) {
      router.push(`/pronostico/dia?city=${encodeURIComponent(forecastData.city)}&date=${day.date}`);
    }
  };

  const getWeatherIcon = (icon) => {
    const iconMap = {
      "01d": "☀️",
      "01n": "🌙",
      "02d": "⛅",
      "02n": "☁️",
      "03d": "☁️",
      "03n": "☁️",
      "04d": "☁️",
      "04n": "☁️",
      "09d": "🌧️",
      "09n": "🌧️",
      "10d": "🌦️",
      "10n": "🌧️",
      "11d": "⛈️",
      "11n": "⛈️",
      "13d": "❄️",
      "13n": "❄️",
      "50d": "🌫️",
      "50n": "🌫️",
    };
    return iconMap[icon] || "🌤️";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: "numeric", month: "short" };
    return date.toLocaleDateString("es-ES", options);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>📅 Pronóstico 5 Días</h1>
        <p className={styles.subtitle}>
          Consulta el pronóstico del tiempo para los próximos 5 días
        </p>
        <p className={styles.apiInfo}>
          ⚡ Haz clic en un día para ver más detalles
        </p>
      </div>

      <div className={styles.inputSection}>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe el nombre de una ciudad..."
            className={styles.input}
          />
          <button 
            onClick={() => fetchForecast(cityInput)} 
            className={styles.searchButton}
            disabled={isLoading || !cityInput.trim()}
          >
            {isLoading ? (
              <span className={styles.loader}></span>
            ) : (
              "🔍 Buscar"
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className={styles.error}>
          ⚠️ {error}
        </div>
      )}

      {forecastData && (
        <div className={styles.forecastContainer}>
          <div className={styles.cityHeader}>
            <h2 className={styles.cityName}>
              <span className={styles.locationIcon}>📍</span>
              {forecastData.city}, {forecastData.country}
            </h2>
          </div>

          <div className={styles.forecastGrid}>
            {forecastData.forecast.map((day, index) => (
              <div 
                key={day.date} 
                className={`${styles.forecastCard} ${index === 0 ? styles.today : ""}`}
                onClick={() => handleDayClick(day)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => e.key === "Enter" && handleDayClick(day)}
              >
                <div className={styles.cardHeader}>
                  <span className={styles.dayName}>{day.dayName}</span>
                  <span className={styles.date}>{formatDate(day.date)}</span>
                </div>

                <div className={styles.weatherIcon}>
                  {getWeatherIcon(day.icon)}
                </div>

                <div className={styles.temperature}>
                  <span className={styles.tempMain}>{day.temperature}°</span>
                  <div className={styles.tempRange}>
                    <span className={styles.tempMax}>↑ {day.tempMax}°</span>
                    <span className={styles.tempMin}>↓ {day.tempMin}°</span>
                  </div>
                </div>

                <p className={styles.description}>{day.description}</p>

                <div className={styles.details}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailIcon}>💧</span>
                    <span className={styles.detailValue}>{day.humidity}%</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailIcon}>💨</span>
                    <span className={styles.detailValue}>{day.windSpeed} m/s</span>
                  </div>
                </div>

                <div className={styles.clickHint}>
                  Click para ver detalles →
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!forecastData && !error && !isLoading && (
        <div className={styles.placeholder}>
          <span className={styles.placeholderIcon}>🌤️</span>
          <p>Busca una ciudad para ver el pronóstico de 5 días</p>
          <span className={styles.hint}>
            Ejemplo: Madrid, Londres, Nueva York, Tokio
          </span>
        </div>
      )}
    </div>
  );
}

export default function MultiCityPage() {
  return (
    <Suspense fallback={
      <div className={styles.container}>
        <div className={styles.loader}></div>
      </div>
    }>
      <ForecastContent />
    </Suspense>
  );
}