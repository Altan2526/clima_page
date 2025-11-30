"use client";

import styles from "./WeatherCard.module.css";

export default function WeatherCard({ weather }) {
  const getWeatherBackground = (icon) => {
    if (icon.includes("01")) return "clear";
    if (icon.includes("02") || icon.includes("03") || icon.includes("04"))
      return "cloudy";
    if (icon.includes("09") || icon.includes("10")) return "rainy";
    if (icon.includes("11")) return "stormy";
    if (icon.includes("13")) return "snowy";
    if (icon.includes("50")) return "misty";
    return "default";
  };

  return (
    <div
      className={`${styles.card} ${styles[getWeatherBackground(weather.icon)]}`}
    >
      <div className={styles.header}>
        <h2 className={styles.city}>
          {weather.city}, {weather.country}
        </h2>
        <p className={styles.description}>{weather.description}</p>
      </div>

      <div className={styles.mainInfo}>
        <img
          src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`}
          alt={weather.description}
          className={styles.weatherIcon}
        />
        <div className={styles.temperature}>
          <span className={styles.tempValue}>{weather.temperature}</span>
          <span className={styles.tempUnit}>°C</span>
        </div>
      </div>

      <p className={styles.feelsLike}>
        Sensación térmica: {weather.feelsLike}°C
      </p>

      <div className={styles.details}>
        <div className={styles.detailItem}>
          <span className={styles.detailIcon}>💧</span>
          <div className={styles.detailText}>
            <span className={styles.detailLabel}>Humedad</span>
            <span className={styles.detailValue}>{weather.humidity}%</span>
          </div>
        </div>

        <div className={styles.detailItem}>
          <span className={styles.detailIcon}>💨</span>
          <div className={styles.detailText}>
            <span className={styles.detailLabel}>Viento</span>
            <span className={styles.detailValue}>{weather.windSpeed} m/s</span>
          </div>
        </div>

        <div className={styles.detailItem}>
          <span className={styles.detailIcon}>🌡️</span>
          <div className={styles.detailText}>
            <span className={styles.detailLabel}>Presión</span>
            <span className={styles.detailValue}>{weather.pressure} hPa</span>
          </div>
        </div>

        <div className={styles.detailItem}>
          <span className={styles.detailIcon}>👁️</span>
          <div className={styles.detailText}>
            <span className={styles.detailLabel}>Visibilidad</span>
            <span className={styles.detailValue}>{weather.visibility} km</span>
          </div>
        </div>

        <div className={styles.detailItem}>
          <span className={styles.detailIcon}>☁️</span>
          <div className={styles.detailText}>
            <span className={styles.detailLabel}>Nubosidad</span>
            <span className={styles.detailValue}>{weather.clouds}%</span>
          </div>
        </div>

        <div className={styles.detailItem}>
          <span className={styles.detailIcon}>🌅</span>
          <div className={styles.detailText}>
            <span className={styles.detailLabel}>Amanecer</span>
            <span className={styles.detailValue}>{weather.sunrise}</span>
          </div>
        </div>

        <div className={styles.detailItem}>
          <span className={styles.detailIcon}>🌇</span>
          <div className={styles.detailText}>
            <span className={styles.detailLabel}>Atardecer</span>
            <span className={styles.detailValue}>{weather.sunset}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
