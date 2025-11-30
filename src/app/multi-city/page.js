"use client";

import { useState, useEffect, Suspense, useRef } from "react";
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
  
  // Estados para autocompletado
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const debounceTimer = useRef(null);
  const inputRef = useRef(null);

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

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Buscar sugerencias con debounce
  const searchSuggestions = async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoadingSuggestions(true);
    try {
      const response = await fetch(`/api/cities/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      if (response.ok && data.cities) {
        setSuggestions(data.cities.slice(0, 8));
        setShowSuggestions(true);
      }
    } catch (err) {
      console.error("Error buscando ciudades:", err);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setCityInput(value);
    
    // Limpiar timer anterior
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    // Establecer nuevo timer con 400ms de delay
    debounceTimer.current = setTimeout(() => {
      searchSuggestions(value);
    }, 400);
  };

  const handleSuggestionClick = (city) => {
    setCityInput(city.name);
    setShowSuggestions(false);
    setSuggestions([]);
    fetchForecast(`${city.name},${city.country}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      setShowSuggestions(false);
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
        <div className={styles.inputWrapper} ref={inputRef}>
          <input
            type="text"
            value={cityInput}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            placeholder="Escribe el nombre de una ciudad..."
            className={styles.input}
          />
          <button 
            onClick={() => { setShowSuggestions(false); fetchForecast(cityInput); }}
            className={styles.searchButton}
            disabled={isLoading || !cityInput.trim()}
          >
            {isLoading ? (
              <span className={styles.loader}></span>
            ) : (
              "🔍 Buscar"
            )}
          </button>
          
          {/* Lista de sugerencias */}
          {showSuggestions && (
            <div className={styles.suggestionsDropdown}>
              {isLoadingSuggestions ? (
                <div className={styles.suggestionLoading}>
                  <span className={styles.miniLoader}></span>
                  Buscando ciudades...
                </div>
              ) : suggestions.length > 0 ? (
                suggestions.map((city, index) => (
                  <div 
                    key={`${city.name}-${city.country}-${index}`}
                    className={styles.suggestionItem}
                    onClick={() => handleSuggestionClick(city)}
                  >
                    <span className={styles.suggestionCity}>{city.name}</span>
                    <span className={styles.suggestionCountry}>{city.countryName}</span>
                  </div>
                ))
              ) : cityInput.length >= 2 ? (
                <div className={styles.noSuggestions}>
                  No se encontraron ciudades
                </div>
              ) : null}
            </div>
          )}
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