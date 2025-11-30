"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";

function DayDetailContent() {
  const searchParams = useSearchParams();
  const [dayData, setDayData] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const city = searchParams.get("city");
  const date = searchParams.get("date");

  useEffect(() => {
    if (city && date) {
      fetchDayData();
    }
  }, [city, date]);

  const fetchDayData = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/weather/day?city=${encodeURIComponent(city)}&date=${date}`
      );
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Error al obtener los datos");
      } else {
        setDayData(data);
      }
    } catch (err) {
      setError("Error de conexión");
    } finally {
      setIsLoading(false);
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
    const options = { weekday: "long", day: "numeric", month: "long", year: "numeric" };
    return date.toLocaleDateString("es-ES", options);
  };

  const formatTime = (timeString) => {
    return timeString.substring(0, 5);
  };

  if (!city || !date) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          ⚠️ Parámetros inválidos. Por favor selecciona un día desde el pronóstico.
        </div>
        <Link href="/multi-city" className={styles.backButton}>
          ← Volver al pronóstico
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <Link href={`/multi-city?city=${encodeURIComponent(city)}`} className={styles.backButton}>
          ← Volver al pronóstico de 5 días
        </Link>
        
        <div className={styles.titleSection}>
          <h1 className={styles.title}>
            <span className={styles.locationIcon}>📍</span>
            {city}
          </h1>
          <p className={styles.dateTitle}>{formatDate(date)}</p>
        </div>
      </div>

      {isLoading && (
        <div className={styles.loadingContainer}>
          <div className={styles.loader}></div>
          <p>Cargando información del día...</p>
        </div>
      )}

      {error && <div className={styles.error}>⚠️ {error}</div>}

      {dayData && (
        <>
          {/* Current Weather Card */}
          {dayData.hourlyForecast && dayData.hourlyForecast.length > 0 && (
            <div className={styles.currentWeather}>
              <div className={styles.currentMain}>
                <span className={styles.currentIcon}>
                  {getWeatherIcon(dayData.hourlyForecast[0].icon)}
                </span>
                <div className={styles.currentTemp}>
                  <span className={styles.tempValue}>{dayData.hourlyForecast[0].temperature}°C</span>
                  <span className={styles.feelsLike}>
                    Sensación: {dayData.hourlyForecast[0].feelsLike}°C
                  </span>
                </div>
              </div>
              <p className={styles.currentDescription}>
                {dayData.hourlyForecast[0].description}
              </p>
              <div className={styles.currentDetails}>
                <div className={styles.detailBox}>
                  <span className={styles.detailIcon}>💧</span>
                  <span className={styles.detailLabel}>Humedad</span>
                  <span className={styles.detailValue}>{dayData.hourlyForecast[0].humidity}%</span>
                </div>
                <div className={styles.detailBox}>
                  <span className={styles.detailIcon}>💨</span>
                  <span className={styles.detailLabel}>Viento</span>
                  <span className={styles.detailValue}>{dayData.hourlyForecast[0].windSpeed} m/s</span>
                </div>
                <div className={styles.detailBox}>
                  <span className={styles.detailIcon}>☁️</span>
                  <span className={styles.detailLabel}>Nubes</span>
                  <span className={styles.detailValue}>{dayData.hourlyForecast[0].clouds}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Day Summary */}
          {dayData.summary && (
            <div className={styles.summaryCard}>
              <h2 className={styles.sectionTitle}>📊 Resumen del Día</h2>
              <div className={styles.summaryGrid}>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Temp. Máxima</span>
                  <span className={`${styles.summaryValue} ${styles.tempMax}`}>
                    {dayData.summary.tempMax}°C
                  </span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Temp. Mínima</span>
                  <span className={`${styles.summaryValue} ${styles.tempMin}`}>
                    {dayData.summary.tempMin}°C
                  </span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Humedad Promedio</span>
                  <span className={styles.summaryValue}>
                    {dayData.summary.humidityAvg}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Hourly Forecast */}
          <div className={styles.hourlySection}>
            <h2 className={styles.sectionTitle}>⏰ Pronóstico por Horas</h2>
            <div className={styles.hourlyGrid}>
              {dayData.hourlyForecast && dayData.hourlyForecast.map((hour, index) => (
                <div key={index} className={styles.hourCard}>
                  <span className={styles.hourTime}>{hour.time}</span>
                  <span className={styles.hourIcon}>{getWeatherIcon(hour.icon)}</span>
                  <span className={styles.hourTemp}>{hour.temperature}°C</span>
                  <span className={styles.hourDesc}>{hour.description}</span>
                  <div className={styles.hourDetails}>
                    <span>💧 {hour.humidity}%</span>
                    <span>💨 {hour.windSpeed} m/s</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {!isLoading && !error && !dayData && (
        <div className={styles.noData}>
          <p>No hay datos disponibles para esta fecha</p>
          <span>El pronóstico detallado solo está disponible para los próximos 5 días</span>
        </div>
      )}
    </div>
  );
}

export default function DayDetailPage() {
  return (
    <Suspense fallback={
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.loader}></div>
          <p>Cargando...</p>
        </div>
      </div>
    }>
      <DayDetailContent />
    </Suspense>
  );
}
